// src/components/DayModal.jsx
import { useState } from "react"
import { MOOD, moodLabel } from "../utils/mood.js"

export default function DayModal({ open, record, onClose, onSave }) {
  const [localMood, setLocalMood] = useState(record?.mood || "")
  const [localMoodNote, setLocalMoodNote] = useState(record?.moodNote || "")

  if (!open || !record) return null

  const moodButtonStyle = (value) => ({
    padding: "6px 12px",
    borderRadius: 4,
    border: "1px solid #ccc",
    background: localMood === value ? "#23aaf2" : "white",
    color: localMood === value ? "white" : "black",
    cursor: "pointer",
    marginRight: 8,
  })

  const handleSave = () => {
    onSave({
      ...record,
      mood: localMood,
      moodNote: localMoodNote,
    })
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 8,
          width: "90%",
          maxWidth: 480,
        }}
      >
        <h3 style={{ marginTop: 0 }}>{record.date} 的记录</h3>

        <div style={{ marginBottom: 12 }}>
          <h4>待办列表（只读）</h4>
          {record.todos?.length ? (
            <ul>
              {record.todos.map((t) => (
                <li key={t.id}>
                  [{t.done ? "✔" : "○"}] {t.text}
                </li>
              ))}
            </ul>
          ) : (
            <p>这一天还没有待办记录。</p>
          )}
        </div>

        <div style={{ marginBottom: 12 }}>
          <h4>心情</h4>
          <button
            type="button"
            style={moodButtonStyle(MOOD.HAPPY)}
            onClick={() => setLocalMood(MOOD.HAPPY)}
          >
            {moodLabel(MOOD.HAPPY)} 
          </button>
          <button
            type="button"
            style={moodButtonStyle(MOOD.NORMAL)}
            onClick={() => setLocalMood(MOOD.NORMAL)}
          >
            {moodLabel(MOOD.NORMAL)}
          </button>
          <button
            type="button"
            style={moodButtonStyle(MOOD.SAD)}
            onClick={() => setLocalMood(MOOD.SAD)}
          >
            {moodLabel(MOOD.SAD)}
          </button>
        </div>

        <div style={{ marginBottom: 12 }}>
          <h4>心情备注</h4>
          <textarea
            rows={3}
            style={{ width: "100%", boxSizing: "border-box" }}
            value={localMoodNote}
            onChange={(e) => setLocalMoodNote(e.target.value)}
          />
        </div>

        <div style={{ textAlign: "right" }}>
          <button
            onClick={onClose}
            style={{ marginRight: 8, padding: "4px 10px" }}
          >
            取消
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: "4px 10px",
              background: "#23aaf2",
              color: "white",
              border: "none",
              borderRadius: 4,
            }}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}
