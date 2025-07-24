export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem("powertracker_user")
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error("Error reading user from localStorage:", error)
    return null
  }
}

// Save user to localStorage
export const saveUser = (user: User): void => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("powertracker_user", JSON.stringify(user))
    localStorage.setItem("powertracker_auth_token", "authenticated")
  } catch (error) {
    console.error("Error saving user to localStorage:", error)
  }
}

// Remove user from localStorage
export const removeUser = (): void => {
  if (typeof window === "undefined") return

  localStorage.removeItem("powertracker_user")
  localStorage.removeItem("powertracker_auth_token")
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false

  const token = localStorage.getItem("powertracker_auth_token")
  const user = getCurrentUser()
  return !!(token && user)
}

// Login function
export const login = async (
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string; user?: User }> => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Get stored users
    const users = getStoredUsers()
    const user = users.find((u) => u.email === email)

    if (!user) {
      return { success: false, error: "User not found" }
    }

    // In a real app, you'd hash and compare passwords
    const storedPassword = localStorage.getItem(`powertracker_password_${user.id}`)
    if (storedPassword !== password) {
      return { success: false, error: "Invalid password" }
    }

    // Save user session
    saveUser(user)

    return { success: true, user }
  } catch (error) {
    return { success: false, error: "Login failed" }
  }
}

// Signup function
export const signup = async (
  name: string,
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string; user?: User }> => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const users = getStoredUsers()
    if (users.find((u) => u.email === email)) {
      return { success: false, error: "User already exists" }
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      createdAt: new Date().toISOString(),
    }

    // Save user
    users.push(newUser)
    localStorage.setItem("powertracker_users", JSON.stringify(users))
    localStorage.setItem(`powertracker_password_${newUser.id}`, password)

    // Save user session
    saveUser(newUser)

    return { success: true, user: newUser }
  } catch (error) {
    return { success: false, error: "Signup failed" }
  }
}

// Logout function
export const logout = (): void => {
  removeUser()
  // Redirect will be handled by the component
}

// Get all stored users
const getStoredUsers = (): User[] => {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem("powertracker_users")
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error reading users from localStorage:", error)
    return []
  }
}

// Update user profile
export const updateProfile = async (
  updates: Partial<Pick<User, "name" | "email">>,
): Promise<{ success: boolean; error?: string; user?: User }> => {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      return { success: false, error: "Not authenticated" }
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Update user
    const updatedUser = { ...currentUser, ...updates }

    // Update in users list
    const users = getStoredUsers()
    const userIndex = users.findIndex((u) => u.id === currentUser.id)
    if (userIndex !== -1) {
      users[userIndex] = updatedUser
      localStorage.setItem("powertracker_users", JSON.stringify(users))
    }

    // Update current session
    saveUser(updatedUser)

    return { success: true, user: updatedUser }
  } catch (error) {
    return { success: false, error: "Profile update failed" }
  }
}

// Change password
export const changePassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const user = getCurrentUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Verify current password
    const storedPassword = localStorage.getItem(`powertracker_password_${user.id}`)
    if (storedPassword !== currentPassword) {
      return { success: false, error: "Current password is incorrect" }
    }

    // Update password
    localStorage.setItem(`powertracker_password_${user.id}`, newPassword)

    return { success: true }
  } catch (error) {
    return { success: false, error: "Password change failed" }
  }
}
