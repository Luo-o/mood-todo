import { useState } from "react"
import { Link } from "react-router-dom"
import { getUser } from "../storage/userStorage"
import { getTodayRecord, saveTodayRecord } from "../storage/dayStorage"
import { MOOD, moodLabel } from "../utils/mood.js"

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

  const moodButtonStyle = (value) => ({
    padding: "6px 12px",
    borderRadius: 4,
    border: "1px solid #ccc",
    cursor: "pointer",
    marginRight: 8,
    background: mood === value ? "#23aaf2" : "white",
    color: mood === value ? "white" : "black",    
  })

  return (
    <div style={{ padding: 20}}>
      <h1>今日待办 & 情绪记录</h1>
      <p style={{ color: '#555'}}>{user.name}，记录你的心情和待办事项，帮助你更好地管理一天的生活！</p>

      <section style={{ marginTop: 20, marginBottom: 32 }}>
        <h2>今日待办</h2>
        <form onSubmit={handleAddTodo} style={{ marginBottom: 12 }}>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="输入新的待办事项"
            style={{ marginRight: 8 }}
          />
          <button type="submit">添加</button>
        </form>

        {
          todos.length === 0 ? (
            <p style={{ color: '#555' }}>暂无待办事项，赶快添加吧！</p>
          ) : (
            <ul>
              {todos.map(todo => (
                <li key={todo.id} style={{ textDecoration: todo.done ? "line-through" : "none" }}>
                  <input
                    type="checkbox"
                    checked={todo.done}
                    onChange={() => handleToggleTodo(todo.id)}
                  />
                  {todo.text}
                  <button onClick={() => handleDeleteTodo(todo.id)} style={{ marginLeft: 8 }}>删除</button>
                </li>
              ))}
            </ul>
          )}
      </section>

      <section>
        <h2>今日心情</h2>
        <div style={{ marginBottom: 12 }}>
          <button
            style={moodButtonStyle(MOOD.HAPPY)}
            onClick={() => setMood(MOOD.HAPPY)}
          >
            {moodLabel(MOOD.HAPPY)}
          </button>
          <button
            style={moodButtonStyle(MOOD.NORMAL)}
            onClick={() => setMood(MOOD.NORMAL)}
          >
            {moodLabel(MOOD.NORMAL)}
          </button>
          <button
            style={moodButtonStyle(MOOD.SAD)}
            onClick={() => setMood(MOOD.SAD)}
          >
            {moodLabel(MOOD.SAD)}
          </button>
        </div>
        <textarea
          value={moodNote}
          onChange={(e) => setMoodNote(e.target.value)}
          placeholder="写下你的心情备注..."
          style={{ width: "100%", height: 80 }}
        />

        <p style={{ marginTop: 8, fontSize: 14, color: "#666"}}>
          当前选择的情绪: {""}
          {mood === MOOD.HAPPY && moodLabel(MOOD.HAPPY)}
          {mood === MOOD.NORMAL && moodLabel(MOOD.NORMAL)}
          {mood === MOOD.SAD && moodLabel(MOOD.SAD)}
        </p>
      </section>

      <div style={{ marginTop: 20 }}>
        <button onClick={handleSaveRecord}>保存今日记录</button>
      </div>
    </div>
  );
}