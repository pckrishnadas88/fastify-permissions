import { test } from 'node:test'
import assert from 'node:assert/strict'
import Fastify from 'fastify'
import permissionPlugin from '../plugin/index.js'

test('should allow access to /admin when user is admin', async (t) => {
  const app = await buildApp()

  const res = await app.inject({
    method: 'GET',
    url: '/admin'
  })

  assert.equal(res.statusCode, 200)
  assert.deepEqual(res.json(), { msg: 'admin ok' })
})

test('should allow access to /is-authenticated when user is present', async (t) => {
  const app = await buildApp()

  const res = await app.inject({
    method: 'GET',
    url: '/is-authenticated'
  })

  assert.equal(res.statusCode, 200)
  assert.deepEqual(res.json(), { msg: 'authenticated ok' })
})

test('should allow access to /public for anyone', async (t) => {
  const app = await buildApp()

  const res = await app.inject({
    method: 'GET',
    url: '/public'
  })

  assert.equal(res.statusCode, 200)
  assert.deepEqual(res.json(), { msg: 'public ok' })
})

test('should block /admin when user is not admin', async (t) => {
  const app = await buildApp({ role: 'guest' })

  const res = await app.inject({
    method: 'GET',
    url: '/admin'
  })

  assert.equal(res.statusCode, 403)
  assert.deepEqual(res.json(), {
    error: 'Forbidden',
    permission: 'isAdmin'
  })
})

// Helper to build app instance with optional user role
async function buildApp(fakeUser = { id: 1, role: 'admin' }) {
  const app = Fastify()

  app.addHook('onRequest', async (req) => {
    req.user = fakeUser
  })

  await app.register(permissionPlugin, {
    conditions: {
      isAdmin: async (req) => req.user?.role === 'admin',
      isAuthenticated: async (req) => !!req.user,
      isPublic: async (_) => true,
      isManager: async (req) => req.user?.role === 'manager'
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

  return app
}
