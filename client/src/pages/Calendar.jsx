import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { getUser } from "../storage/userStorage"
import { listAllRecords, saveRecordByDate } from "../storage/dayStorage"
import { MOOD, moodLabel } from "../utils/mood.js"
import DayModal from "../components/DayModal.jsx"

function generateMothGrid(year, month) {
  const firstDay = new Date(year, month - 1, 1)
  const startWeekday = firstDay.getDay() // 0-6 星期天到星期六
  const daysInMonth = new Date(year, month, 0).getDate() 

  const cells = []
  for (let i = 0; i < 42; i++) {
    const dayNum = i - startWeekday + 1
    if (dayNum < 1 || dayNum > daysInMonth) {
      cells.push(null)
    } else {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
      cells.push({day: dayNum, dateStr})
    }
  }

    return cells
}

export default function Calendar() {
  const user = getUser()
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1)

  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const monthMap = useMemo(() => {
    if(!user || !user.name) return {}

    const all = listAllRecords()
    const monthPrefix = `${currentYear}-${String(currentMonth).padStart(2, '0')}-`
    const map = {}
    all.forEach((record) => {
      if(record.date?.startsWith(monthPrefix)) {
        map[record.date] = record
      }
    })
    return map
  }, [user, currentYear, currentMonth])

  const cells = useMemo(
    () => generateMothGrid(currentYear, currentMonth),
    [currentYear, currentMonth]
  )

  if(!user || !user.name) {
    return (
      <div style={{ padding: 20 }}>
        <h1>日历视图</h1>
        <p>你还没有登录，请先前往登录页面。</p>
        <Link to="/login" style={{ color: "#23aaf2" }}>
          去登录
        </Link>
      </div>
    )
  }

  const handlePrevMonth = () => {
    setSelectedDate(null)
    setSelectedRecord(null)
    setModalOpen(false)

      if(currentMonth === 1) {
        setCurrentYear(currentYear - 1)
        setCurrentMonth(12)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
  }

  const handleNextMonth = () => {
    setSelectedDate(null)
    setSelectedRecord(null)
    setModalOpen(false)

      if(currentMonth === 12) {
        setCurrentYear(currentYear + 1)
        setCurrentMonth(1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
  }

  const handleDayClick = (dateStr) => {
    const record = monthMap[dateStr] || { date: dateStr, todos: [], mood: "", moodNote: "" }
    setSelectedDate(dateStr)
    setSelectedRecord(record)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedDate(null)
    setSelectedRecord(null)
  }

  const handleSaveRecord = (newRecord) => {
    saveRecordByDate(newRecord.date, newRecord)
    handleCloseModal()
  }

  return (
<div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h1>日历视图</h1>
      {
        selectedDate && (
          <p style={{ color: '#555' }}>
            你正在查看 {selectedDate} 的记录。
          </p>
        )
      }
      {/* 月份切换 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 16,
          gap: 8,
        }}
      >
        <button onClick={handlePrevMonth}>&lt;</button>
        <span>
          {currentYear} 年 {currentMonth} 月
        </span>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>

      {/* 星期标题 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          textAlign: "center",
          marginBottom: 8,
          fontWeight: "bold",
        }}
      >
        <div>日</div>
        <div>一</div>
        <div>二</div>
        <div>三</div>
        <div>四</div>
        <div>五</div>
        <div>六</div>
      </div>

      {/* 日历格子 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 4,
        }}
      >
        {cells.map((cell, idx) => {
          if (!cell) {
            return (
              <div
                key={idx}
                style={{
                  border: "1px solid #eee",
                  minHeight: 60,
                  background: "#fafafa",
                }}
              />
            )
          }

          const rec = monthMap[cell.dateStr]
          const hasRecord = !!rec

          return (
            <div
              key={cell.dateStr}
              onClick={() => handleDayClick(cell.dateStr)}
              style={{
                border: "1px solid #ddd",
                minHeight: 60,
                padding: 4,
                cursor: "pointer",
                background: hasRecord ? "#e6f4ff" : "white",
                fontSize: 12,
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: 4 }}>
                {cell.day}
              </div>
              {hasRecord && (
                <div style={{ color: "#555" }}>
                  {rec.todos?.length || 0} 条待办
                  <br />
                  {rec.mood === MOOD.HAPPY
                    ? moodLabel(MOOD.HAPPY)
                    : rec.mood === MOOD.NORMAL
                    ? moodLabel(MOOD.NORMAL)
                    : rec.mood === MOOD.SAD
                    ? moodLabel(MOOD.SAD)
                    : "无心情记录"}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 弹窗 */}
      <DayModal
        key={selectedRecord?.date}
        open={modalOpen}
        record={selectedRecord}
        onClose={handleCloseModal}
        onSave={handleSaveRecord}
      />
    </div>
  )
}