// src/components/PendingTodoBarrage.jsx
import "./PendingTodoBarrage.css"

export default function PendingTodoBarrage({ items = [], title = "未完成待办弹幕" }) {
  if (!items.length) return null

  // 重复一份用于无缝滚动
  const displayItems = [...items, ...items]

  return (
    <div className="barrage-container">
      <div className="barrage-header">{title}</div>
      <div className="barrage-viewport">
        <div className="barrage-track">
          {displayItems.map((item, index) => {
            const day = item.date?.slice(5) || "" // "YYYY-MM-DD" -> "MM-DD"
            return (
              <div
                key={item.id ?? `${item.date}-${index}`}
                className="barrage-item"
                title={item.text}
              >
                <span className="barrage-item-date">[{day}]</span>
                <span className="barrage-item-text">{item.text}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
