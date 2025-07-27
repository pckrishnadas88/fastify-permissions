// examples/auth.js
export async function fakeAuth(req, reply) {
  req.user = { id: 1, name: 'Krishnadas', roles: 'admins' }
}
