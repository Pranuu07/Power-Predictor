export interface User {
  id: string
  name: string
  email: string
  createdAt: string
  lastLogin: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

const USERS_KEY = "powertracker_users"
const CURRENT_USER_KEY = "powertracker_user"
const PASSWORD_PREFIX = "powertracker_password_"

export function hashPassword(password: string): string {
  // Simple hash function for demo purposes
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash.toString()
}

export function generateUserId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

export function saveUser(user: User, password: string): void {
  if (typeof window === "undefined") return

  const users = getUsers()
  users[user.id] = user

  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  localStorage.setItem(PASSWORD_PREFIX + user.id, hashPassword(password))
}

export function getUsers(): Record<string, User> {
  if (typeof window === "undefined") return {}

  const users = localStorage.getItem(USERS_KEY)
  return users ? JSON.parse(users) : {}
}

export function getUserByEmail(email: string): User | null {
  const users = getUsers()
  return Object.values(users).find((user) => user.email === email) || null
}

export function validatePassword(userId: string, password: string): boolean {
  if (typeof window === "undefined") return false

  const storedHash = localStorage.getItem(PASSWORD_PREFIX + userId)
  return storedHash === hashPassword(password)
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem(CURRENT_USER_KEY)
  return userStr ? JSON.parse(userStr) : null
}

export function setCurrentUser(user: User | null): void {
  if (typeof window === "undefined") return

  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

export function updateUser(userId: string, updates: Partial<User>): User | null {
  if (typeof window === "undefined") return null

  const users = getUsers()
  const user = users[userId]

  if (!user) return null

  const updatedUser = { ...user, ...updates }
  users[userId] = updatedUser

  localStorage.setItem(USERS_KEY, JSON.stringify(users))

  // Update current user if it's the same user
  const currentUser = getCurrentUser()
  if (currentUser && currentUser.id === userId) {
    setCurrentUser(updatedUser)
  }

  return updatedUser
}

export function updatePassword(userId: string, newPassword: string): boolean {
  if (typeof window === "undefined") return false

  localStorage.setItem(PASSWORD_PREFIX + userId, hashPassword(newPassword))
  return true
}

export function signUp(
  name: string,
  email: string,
  password: string,
): { success: boolean; message: string; user?: User } {
  // Check if user already exists
  const existingUser = getUserByEmail(email)
  if (existingUser) {
    return { success: false, message: "User with this email already exists" }
  }

  // Create new user
  const user: User = {
    id: generateUserId(),
    name,
    email,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  }

  // Save user and password
  saveUser(user, password)
  setCurrentUser(user)

  return { success: true, message: "Account created successfully", user }
}

export function signIn(email: string, password: string): { success: boolean; message: string; user?: User } {
  const user = getUserByEmail(email)

  if (!user) {
    return { success: false, message: "User not found" }
  }

  if (!validatePassword(user.id, password)) {
    return { success: false, message: "Invalid password" }
  }

  // Update last login
  const updatedUser = updateUser(user.id, { lastLogin: new Date().toISOString() })

  return { success: true, message: "Signed in successfully", user: updatedUser || user }
}

export function signOut(): void {
  setCurrentUser(null)
}
