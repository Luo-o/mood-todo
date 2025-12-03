const KEY = "common_todos"

const DEFAULT_COMMON_TODOS = [
  { id: 1, emoji: "🥾", text: "爬山" },
  { id: 2, emoji: "🚶‍♂️", text: "徒步" },
  { id: 3, emoji: "🏊‍♀️", text: "游泳" },
  { id: 4, emoji: "🚴‍♀️", text: "骑行" },
]

export function listCommonTodos() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT_COMMON_TODOS
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_COMMON_TODOS
    }
    return parsed
  } catch (e) {
    console.error("读取常用待办失败:", e)
    return DEFAULT_COMMON_TODOS
  }
}

export function saveCommonTodos(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items))
  } catch (e) {
    console.error("保存常用待办失败:", e)
  }
}
