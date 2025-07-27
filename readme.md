# fastify-permissions

> 🔐 Route-level permission middleware for Fastify — supports custom permission checks

[![npm version](https://img.shields.io/npm/v/fastify-permissions)](https://www.npmjs.com/package/fastify-permissions)

[![npm downloads](https://img.shields.io/npm/dm/fastify-permissions)](https://www.npmjs.com/package/fastify-permissions)

[![license](https://img.shields.io/github/license/pckrishnadas88/fastify-permissions)](./LICENSE)

---

## ✨ Features

- ✅ Add permissions to routes using `config.permissions`
- ✅ Register custom permission checks (e.g. `isAdmin`, `isAuthenticated`)
- ✅ Supports multiple permissions per route
- ✅ Denies requests with a customizable `403 Forbidden` error
- ✅ Compatible with `fastify` v5

---

## 📦 Setup

```bash
npm i fastify-permissions
```

## 🚀 Usage
---

## Usage

### Register Plugin

```js
import Fastify from 'fastify'
import fastifyPermissions from 'fastify-permissions'

const app = Fastify()

// Add a fake user to the request
app.addHook('onRequest', async (req) => {
  const role = req.headers['x-role'] || 'guest'
  req.user = { id: 1, role }
})

app.register(fastifyPermissions, {
  conditions: {
    isAdmin: async (req) => req.user?.role === 'admin',
    isAuthenticated: async (req) => !!req.user,
    isPublic: async (_) => true,
    isManager: async (req) => req.user?.role === 'manager'
  }
})

app.get('/admin', {
  config: {
    permissions: ['isAdmin']
  },
  handler: async (req, reply) => {
    reply.send({ msg: 'admin ok' })
  }
})

app.get('/user', {
  config: {
    permissions: ['isAuthenticated']
  },
  handler: async (req, reply) => {
    reply.send({ msg: 'user ok' })
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

app.get('/manager', {
  config: {
    permissions: ['isAdmin', 'isManager']
  },
  handler: async (req, reply) => {
    reply.send({ msg: 'manager ok' })
  }
})

app.listen({ port: 3000 })
```

---

## Output Examples

### ✅ Successful Request

```js
// Simulate a request with role = 'admin'
curl -H "x-role: admin" http://localhost:3000/admin
// Response:
// { "msg": "admin ok" }

curl -H "x-role: admin" http://localhost:3000/manager
// Response:
// { "msg": "manager ok" }

curl http://localhost:3000/public
// Response:
// { "msg": "public ok" }
```

### 🚫 Forbidden Request

```js
// Simulate forbidden request using same app setup
import Fastify from 'fastify'
import fastifyPermissions from 'fastify-permissions'

const app = Fastify()

app.addHook('onRequest', async (req) => {
  req.user = { id: 1, role: 'guest' } // 👈 Not an admin
})

app.register(fastifyPermissions, {
  conditions: {
    isAdmin: async (req) => req.user?.role === 'admin'
  }
})

app.get('/admin', {
  config: {
    permissions: ['isAdmin']
  },
  handler: async (req, reply) => {
    reply.send({ msg: 'admin ok' })
  }
})

app.inject({
  method: 'GET',
  url: '/admin'
}).then(res => {
  console.log(res.statusCode) // 403
  console.log(res.json())     // { error: 'Forbidden', permission: 'isAdmin' }
})
```


```js
// Simulate a request with role = 'guest'
curl -H "x-role: guest" http://localhost:3000/admin
// Response:
// {
//   "error": "Forbidden",
//   "permission": "isAdmin"
// }

curl -H "x-role: admin" http://localhost:3000/manager
// Response:
// {
//   "error": "Forbidden",
//   "permission": "isManager"
// }
```

---


#  Example
## Run the sample app:

```bash
node examples/basic.js
```
# Multiple permissions support as array

```js
permissions: ['isAdmin', 'isAuthenticated']
```
All conditions must pass (AND logic)

⭐ Star This Project

If you find this plugin useful, give it a ⭐ on GitHub!

https://github.com/pckrishnadas88/fastify-permissions

## License

## Run tests

```bash
npm test
```

MIT License © 2025 Krishnadas P.C