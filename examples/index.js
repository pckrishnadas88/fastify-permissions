import Fastify from 'fastify'
import permissionPlugin from '../plugin/index.js'

const app = Fastify()

// Fake auth with req.user
app.addHook('onRequest', async (req) => {
  req.user = { id: 1, role: 'admins' }
})



await app.register(permissionPlugin, {
  conditions: {
    isAdmin: async (req) => req.user?.role === 'admin',
    isAuthenticated: async (req) => !!req.user,
    isPublic: async (_) => true,
    isManager: async (req) => true
  }
})

app.get('/admin', {
  config: {
    permissions: ['isAdmin', 'isPublic']
  },
  handler: async (req, reply) => {
    reply.send({ msg: 'admin ok' })
  }
})
app.get('/is-authenticated', {
  config: {
    permissions: ['isAuthenticated']
  },
  handler: async (req, reply) => {
    reply.send({ msg: 'authenticated ok' })
  }
})


app.get('/public', {
  config: {
    permissions: ['isPublic']
  },
  handler: async (req, reply) => {
    reply.send({ msg: 'public ok' })
  }
})


app.listen({ port: 3000 })