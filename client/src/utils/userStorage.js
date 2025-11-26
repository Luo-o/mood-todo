const USER_STORAGE_KEY = 'mood-todo-user'

// 保存用户信息到 localStorage
export function saveUser(name) {
  const data = { name: name.trim()}
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data))
}

// 从 localStorage 读取用户信息
export function getUser() {
  try {
    const data = localStorage.getItem(USER_STORAGE_KEY)
    if (!data) return null
    return JSON.parse(data) // 字符串转对象
  } catch (e) {
    console.error('读取用户信息失败', e)
    return null
  }
}

// 清除本地存储的用户信息
export function clearUser() {
  localStorage.removeItem(USER_STORAGE_KEY)
}