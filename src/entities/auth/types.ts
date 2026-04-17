export type UserRole = 'ADMIN' | 'OPS' | 'DELIVERY'

export interface AuthUser {
  username: string
  displayName: string
  roles: UserRole[]
}

export interface LoginPayload {
  username: string
  password: string
}