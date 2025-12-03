// src/components/CommonTodos/CommonTodos.jsx
import { useState } from "react"
import "./CommonTodos.css"
import { listCommonTodos, saveCommonTodos } from "../../storage/commonTodoStorage"

/**
 * 常用待办泡泡组件
 *
 * props:
 * - onSelect(item): 非编辑模式下点击泡泡时调用，item 包含 { id, emoji, text }
 */
export default function CommonTodos({ onSelect }) {
  const [commonTodos, setCommonTodos] = useState(() => listCommonTodos())
  const [editing, setEditing] = useState(false)
  const [newEmoji, setNewEmoji] = useState("🏃")
  const [newText, setNewText] = useState("")

  const toggleEditing = () => {
    setEditing((prev) => !prev)
  }

  // 点击泡泡 → 加到今日待办
  const handlePillClick = (item) => {
    if (editing) return
    onSelect && onSelect(item)
  }

  // 编辑模式下删除一个常用待办
  const handleDelete = (id) => {
    const next = commonTodos.filter((c) => c.id !== id)
    setCommonTodos(next)
    saveCommonTodos(next)
  }

  // 编辑模式下添加一个新的常用待办
  const handleAdd = (e) => {
    e.preventDefault()
    const text = newText.trim()
    if (!text) return

    const emoji = (newEmoji || "").trim() || "🔖"
    const next = [
      ...commonTodos,
      {
        id: Date.now() + Math.random(),
        emoji,
        text,
      },
    ]
    setCommonTodos(next)
    saveCommonTodos(next)
    setNewText("")
  }

  return (
    <div className="common-todos">
      <div className="common-todos-header">
        <span>常用待办</span>
        <button type="button" className="link-button" onClick={toggleEditing}>
          {editing ? "完成" : "编辑"}
        </button>
      </div>

      <div className="common-todos-list">
        {commonTodos.map((item) => (
          <button
            key={item.id}
            type="button"
            className="common-todo-pill"
            onClick={() => handlePillClick(item)}
          >
            <span className="common-todo-pill-emoji">{item.emoji}</span>
            <span className="common-todo-pill-text">{item.text}</span>

            {editing && (
              <span
                className="common-todo-pill-delete"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(item.id)
                }}
              >
                −
              </span>
            )}
          </button>
        ))}

        {!commonTodos.length && (
          <span className="common-todos-empty">
            还没有常用待办，先添加一个吧～
          </span>
        )}
      </div>

      {editing && (
        <form className="common-todos-edit-form" onSubmit={handleAdd}>
          <input
            className="common-todos-emoji-input"
            value={newEmoji}
            onChange={(e) => setNewEmoji(e.target.value)}
            maxLength={2}
          />
          <input
            className="common-todos-text-input"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="输入常用待办，如 爬山 / 游泳"
          />
          <button type="submit" className="btn-secondary">
            添加
          </button>
        </form>
      )}
    </div>
  )
}
