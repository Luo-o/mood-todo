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

// 获取指定day的记录
export function getRecordByDate(dateStr) {
  const user = getUser()
  if (!user || !user.name) return null

  const key = buildDayKey(dateStr, user.name)
  const raw = localStorage.getItem(key)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch (e) {
    console.error("解析记录失败", e)
    return null
  }
}
// 保存指定day的记录
export function saveRecordByDate(dateStr, data) {
  const user = getUser()
  if (!user || !user.name) return

  const key = buildDayKey(dateStr, user.name)
  const record = {
    ...data,
    date: dateStr,
  }
  localStorage.setItem(key, JSON.stringify(record))
}

// 获取today的记录
export function getTodayRecord() {
  const todayStr = getTodayStr()
  return getRecordByDate(todayStr)
}
// 保存today的记录
export function saveTodayRecord(data) {
  const todayStr = getTodayStr()
  return saveRecordByDate(todayStr, data)
}

// 获取user所有记录
export function listAllRecords() {
  const user = getUser()
  if (!user || !user.name) return []

  const prefix = `${DAY_STORAGE_PREFIX}${user.name}_`
  const records = []

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key.startsWith(prefix)) {
      const raw = localStorage.getItem(key)
      try {
        const record = JSON.parse(raw)
        records.push(record)
      } catch (e) {
        console.error('解析记录失败', e)
      }
    }
  }
  records.sort((a, b) => (a.date < b.date ? 1 : -1)) // 按日期降序排序
  return records
}