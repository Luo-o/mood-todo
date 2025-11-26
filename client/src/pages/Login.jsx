import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { saveUser, getUser } from "../utils/userStorage"
export default function Login() {
  const [username, setUsername] = useState("") // 用户名输入框的state
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const existingUser = getUser()
  if (existingUser && existingUser.name) {
    // 已登录，跳转到 待办界面
    navigate("/today")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmedName = username.trim()
    if (!trimmedName) {
      setError("用户名不能为空")
      return
    }
    saveUser(trimmedName)
    navigate("/today")
  }

  return (
    <div style={{ padding: 20}}>
      <h1>欢迎使用情绪待办助手</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            昵称：
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
        </div>
        {error && 
          <p style={{ color: "red" }}>{error}</p>
        }
        <button type="submit">登录</button>
      </form>
    </div>
  );
}