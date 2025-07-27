export function withPermissions(permissions, handler) {
  handler._permissions = permissions
  return handler
}