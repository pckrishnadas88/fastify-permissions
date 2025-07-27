# fastify-permissions

> 🔐 Route-level permission middleware for Fastify — supports custom permission checks, role guards, and RBAC-style control.

[![license](https://img.shields.io/github/license/YOUR_GITHUB/fastify-permissions)](./LICENSE)
[![CI](https://github.com/YOUR_GITHUB/fastify-permissions/actions/workflows/test.yml/badge.svg)](https://github.com/YOUR_GITHUB/fastify-permissions)

---

## ✨ Features

- ✅ Add permissions to routes using `config.permissions`
- ✅ Register custom permission checks (e.g. `isAdmin`, `isAuthenticated`)
- ✅ Supports multiple permissions per route
- ✅ Denies requests with a customizable `403 Forbidden` error
- ✅ Compatible with `fastify` v4 and v5
- ✅ Simple RBAC/ABAC integration

---

## 📦 Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/YOUR_GITHUB/fastify-permissions.git
cd fastify-permissions
npm install
```

## 🚀 Usage
### Register the plugin with custom permission checks:
```js
import Fastify from 'fastify'
import fastifyPermissions from './src/index.js'

const app = Fastify()

// Inject mock user
app.addHook('onRequest', async (req) => {
  req.user = { role: 'admin' }
})

// Register with permission conditions
await app.register(fastifyPermissions, {
  conditions: {
    isAdmin: async (req) => req.user?.role === 'admin',
    isAuthenticated: async (req) => !!req.user,
  }
})
```
## Add permissions to routes:

```js
app.get('/admin', {
  config: {
    permissions: ['isAdmin']
  },
  handler: async (req, reply) => {
    return { message: 'Welcome admin' }
  }
})

app.get('/dashboard', {
  config: {
    permissions: ['isAuthenticated']
  },
  handler: async (req, reply) => {
    return { message: 'User Dashboard' }
  }
})
```

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