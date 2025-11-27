import { getUser } from "./userStorage"

const DAY_STORAGE_PREFIX = 'mood_todo_day_'

export function getTodayStr() {
  // 获取今日日期，格式 YYYY-MM-DD
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function buildDayKey(dateStr, username) {
  // 构建存储 key，格式 mood_todo_day_{username}_{dateStr}
  return `${DAY_STORAGE_PREFIX}${username}_${dateStr}`
}

export function getTodayRecord() {
  const user = getUser()
  if (!user || !user.name) return null

  const dataStr = getTodayStr()
  const key = buildDayKey(dataStr, user.name)

  const raw = localStorage.getItem(key)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch (e) {
    console.error('解析今日记录失败', e)
    return null
  }
}

export function saveTodayRecord(data) {
  const user = getUser()
  if (!user || !user.name) return

  const dataStr = getTodayStr()
  const key = buildDayKey(dataStr, user.name)

  const record = {
    ...data,
    date: dataStr
  }
  localStorage.setItem(key, JSON.stringify(record))
  }