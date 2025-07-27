import fp from 'fastify-plugin'

export default fp(async function fastifyPermissions(fastify, opts = {}) {
  const conditions = opts.conditions || {}
  const permissionMap = new Map()

  // Hook to store permissions during route registration
  fastify.addHook('onRoute', (route) => {
    const perms = route.config?.permissions
    if (perms) {
      const key = `${route.method.toUpperCase()} ${route.url}`
      //console.log(`key is: ${key}`)
      permissionMap.set(key, perms)
    }
  })

  // Enforce permissions before route handler
  fastify.addHook('preHandler', async (req, reply) => {
    //console.log(permissionMap)
    const key = `${req.method.toUpperCase()} ${req.url}`
    //console.log(`key is: ${key}`)
    const currentPermissionToCheck = permissionMap.get(key)
    const currentPermissionToCheckArray = [...currentPermissionToCheck]
    //console.log(`current permissions to check ${currentPermissionToCheckArray}`)
    if (!currentPermissionToCheckArray || currentPermissionToCheckArray.length === 0) return

    for (const perm of currentPermissionToCheckArray) {
      const check = conditions[perm]
      if (!check) {
        throw new Error(`Unknown permission: ${perm}`)
      }

      const allowed = await check(req)
      if (!allowed) {
        return reply.code(403).send({ error: 'Forbidden', permission: perm })
      }
    }
  })
})
