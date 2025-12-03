import { useState } from "react"
import { Link } from "react-router-dom"
import { getUser } from "../storage/userStorage"
import { getTodayRecord, saveTodayRecord } from "../storage/dayStorage"
import { MOOD, moodLabel } from "../utils/mood.js"
import "../styles/today.css"

export default function Today() {
  const user = getUser()

  const initialRecord = user ? getTodayRecord() : null

  const [todos, setTodos] = useState(initialRecord?.todos || [])
  const [newTodo, setNewTodo] = useState("")
  const [mood, setMood] = useState(initialRecord?.mood || "")
  const [moodNote, setMoodNote] = useState(initialRecord?.moodNote || "")

  if (!user || !user.name) {
    // 未登录，跳转到 登录界面
    return (
      <Link to="/login">请先登录</Link>
    )
  }

  const handleAddTodo = (e) => {
    e.preventDefault()
    const text = newTodo.trim()
    if(!text) return
    const newItem = {
      id: Date.now(),
      text,
      done: false
    }
    setTodos([...todos, newItem])
    setNewTodo("")
  }

  const handleToggleTodo = (id) => {
    // 切换待办项的完成状态: 当前选中项置反
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ))
  }

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const handleSaveRecord = () => {
    const record = {
      todos,
      mood,
      moodNote
    }
    saveTodayRecord(record)
    alert("今日记录已保存！")
  }

  return (
    <div className="today-page">
      <h1>今日待办 & 情绪记录</h1>
      <p className="today-subtitle">
        {user.name}，记录你的心情和待办事项，帮助你更好地管理一天的生活！
      </p>

      <section className="today-section">
        <h2>今日待办</h2>
        <form onSubmit={handleAddTodo} className="todo-form">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="输入新的待办事项"
            className="todo-input"
          />
          <button type="submit">添加</button>
        </form>

        {todos.length === 0 ? (
          <p className="today-subtitle">暂无待办事项，赶快添加吧！</p>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={`todo-item ${todo.done ? "todo-item--done" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => handleToggleTodo(todo.id)}
                />
                <span className="todo-item-text">{todo.text}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="todo-delete-btn"
                >
                  删除
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="today-section">
        <h2>今日心情</h2>
        <div className="mood-buttons">
          <button
            type="button"
            className={`mood-button ${
              mood === MOOD.HAPPY ? "is-active" : ""
            }`}
            onClick={() => setMood(MOOD.HAPPY)}
          >
            {moodLabel(MOOD.HAPPY)}
          </button>
          <button
            type="button"
            className={`mood-button ${
              mood === MOOD.NORMAL ? "is-active" : ""
            }`}
            onClick={() => setMood(MOOD.NORMAL)}
          >
            {moodLabel(MOOD.NORMAL)}
          </button>
          <button
            type="button"
            className={`mood-button ${mood === MOOD.SAD ? "is-active" : ""}`}
            onClick={() => setMood(MOOD.SAD)}
          >
            {moodLabel(MOOD.SAD)}
          </button>
        </div>

        <textarea
          value={moodNote}
          onChange={(e) => setMoodNote(e.target.value)}
          placeholder="写下你的心情备注..."
          className="mood-note"
        />

        <p style={{ marginTop: 8, fontSize: 14, color: "#666" }}>
          当前选择的情绪:{" "}
          {mood === MOOD.HAPPY && moodLabel(MOOD.HAPPY)}
          {mood === MOOD.NORMAL && moodLabel(MOOD.NORMAL)}
          {mood === MOOD.SAD && moodLabel(MOOD.SAD)}
        </p>
      </section>

      <div className="today-save">
        <button onClick={handleSaveRecord} className="today-save-btn">保存今日记录</button>
      </div>
    </div>
  )
}