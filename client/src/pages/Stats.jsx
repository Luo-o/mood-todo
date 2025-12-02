import { useState } from "react"
import { Link } from "react-router-dom"
import ReactECharts from "echarts-for-react"
import { getUser } from "../storage/userStorage"
import { listAllRecords } from "../storage/dayStorage"
import { MOOD, moodLabel } from "../utils/mood.js"
import StatCard from "../components/StatCard"
import PendingTodoBarrage from "../components/PendingTodoBarrage.jsx"

export default function Stats() {
  const user = getUser()
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1)

  if (!user || !user.name) {
    return (
      <div style={{ padding: 20 }}>
        <h1>统计视图</h1>
        <p>你还没有登录，请先前往登录页面。</p>
        <Link to="/login" style={{ color: "#23aaf2" }}>
          去登录
        </Link>
      </div>
    )
  }

  const allRecords = listAllRecords()

  // 获取当前月
  const monthStr = String(currentMonth).padStart(2, "0")
  const monthRecords = allRecords.filter((rec) =>
    rec.date?.startsWith(`${currentYear}-${monthStr}`)
  )

  // 计算展示的统计值
  let totalTodos = 0
  let doneTodos = 0
  const moodCounts = {
    [MOOD.HAPPY]: 0,
    [MOOD.NORMAL]: 0,
    [MOOD.SAD]: 0,
  }
  const dailyDoneMap = {} // dateStr -> 完成数
  const pendingTodos = []

  monthRecords.forEach((rec) => {
    const todos = rec.todos || []
    totalTodos += todos.length

    todos.forEach((t) => {
      if (t.done) {
        doneTodos += 1
        if (!dailyDoneMap[rec.date]) {
          dailyDoneMap[rec.date] = 0
        }
        dailyDoneMap[rec.date] += 1
      } else{
        pendingTodos.push(
          {
            date: rec.date,
            ...t,
          }
        )
      }
    })

    if (rec.mood && rec.mood in moodCounts) {
      moodCounts[rec.mood] += 1
    }
  })

  const completionRate = totalTodos
    ? Math.round((doneTodos / totalTodos) * 100)
    : 0

  //  出现最多的心情
  let topMood = ""
  let maxCount = 0
  Object.entries(moodCounts).forEach(([mood, count]) => {
    if (count > maxCount) {
      maxCount = count
      topMood = mood
    }
  })

  const dates = Object.keys(dailyDoneMap).sort()
  const dayLabels = dates.map((d) => d.slice(-2)) 
  const dailyDoneData = dates.map((d) => dailyDoneMap[d])

  const dailyDoneOption = {
    title: {
      text: "本月每日完成待办数",
      left: "center",
      textStyle: { fontSize: 14 },
    },
    tooltip: { trigger: "axis" },
    grid: {
      left: "8%",
      right: "4%",
      bottom: "10%",
      top: "20%",
    },
    xAxis: {
      type: "category",
      data: dayLabels,
      name: "日期",
      axisLabel: {
        formatter: (val) => `${val}日`,
      },
    },
    yAxis: {
      type: "value",
      name: "完成数量",
      minInterval: 1,
    },
    series: [
      {
        name: "完成待办数",
        type: "line",
        smooth: true,
        data: dailyDoneData,
      },
    ],
  }

  const moodOption = {
    title: {
      text: "本月心情分布",
      left: "center",
      textStyle: { fontSize: 14 },
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}：{c} 天（{d}%）",
    },
    legend: {
      bottom: 0,
    },
    series: [
      {
        name: "心情",
        type: "pie",
        radius: "60%",
        center: ["50%", "50%"],
        data: [
          {
            value: moodCounts[MOOD.HAPPY] || 0,
            name: moodLabel(MOOD.HAPPY),
          },
          {
            value: moodCounts[MOOD.NORMAL] || 0,
            name: moodLabel(MOOD.NORMAL),
          },
          {
            value: moodCounts[MOOD.SAD] || 0,
            name: moodLabel(MOOD.SAD),
          },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.2)",
          },
        },
      },
    ],
  }


  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear((y) => y - 1)
      setCurrentMonth(12)
    } else {
      setCurrentMonth((m) => m - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear((y) => y + 1)
      setCurrentMonth(1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
  }

  const moodText = topMood
    ? `${moodLabel(topMood)}（共 ${moodCounts[topMood] || 0} 天）`
    : "本月还没有心情记录"

  if (!monthRecords.length) {
    return (
      <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
        <h1>统计视图</h1>

        {/* 月份切换 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <button onClick={handlePrevMonth}>&lt;</button>
          <span>
            {currentYear} 年 {currentMonth} 月
          </span>
          <button onClick={handleNextMonth}>&gt;</button>
        </div>

        <div
          style={{
            padding: 16,
            borderRadius: 12,
            background: "#f7faff",
            border: "1px dashed #23aaf2",
            textAlign: "center",
            marginTop: 24,
          }}
        >
          <p style={{ marginBottom: 8 }}>本月还没有任何记录哦～</p>
          <p style={{ marginTop: 0, fontSize: 14, color: "#666" }}>
            先去日历或首页添加一些待办和心情，再回来看看统计吧。
          </p>
          <Link
            to="/"
            style={{
              display: "inline-block",
              marginTop: 12,
              padding: "6px 14px",
              borderRadius: 6,
              background: "#23aaf2",
              color: "white",
              textDecoration: "none",
            }}
          >
            去添加今日记录
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: "0 auto" }}>
      <h1>统计视图</h1>

      {/* 月份切换 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <button onClick={handlePrevMonth}>&lt;</button>
        <span>
          {currentYear} 年 {currentMonth} 月
        </span>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>

      {/* 顶部两块横向卡片 */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <StatCard title="本月待办情况" background="#f3f8ff">
          <p style={{ margin: 0, fontSize: 14, color: "#555" }}>
            共记录待办：<strong>{totalTodos}</strong> 项
          </p>
          <p style={{ margin: 0, fontSize: 14, color: "#555" }}>
            已完成待办：<strong>{doneTodos}</strong> 项
          </p>
          <p style={{ marginTop: 8, fontSize: 12, color: "#888" }}>
            （统计范围：本月所有有记录的日期）
          </p>
        </StatCard>

        <StatCard title="完成率" background="#f0fbf4">
          <p style={{ margin: 0, fontSize: 14, color: "#555" }}>
            本月待办完成率：
          </p>
          <p
            style={{
              margin: 0,
              marginTop: 4,
              fontSize: 24,
              fontWeight: "bold",
            }}
          >
            {totalTodos ? `${completionRate}%` : "-"}
          </p>
          <p style={{ marginTop: 8, fontSize: 12, color: "#888" }}>
            （至少要有 1 条待办才会计算哦）
          </p>
        </StatCard>
      </div>
            
      <PendingTodoBarrage items={pendingTodos} />

      {/* 折线图卡片（你也可以用 StatCard 包起来，看你喜好） */}
      <div
        style={{
          marginBottom: 24,
          padding: 16,
          borderRadius: 12,
          background: "white",
          boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
        }}
      >
        <ReactECharts option={dailyDoneOption} style={{ height: 280 }} />
      </div>

      {/* 心情卡片 + 饼图 一行排列 */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 24,
          flexWrap: "wrap",   // 小屏自动换行
        }}
      >
        <StatCard
          title="本月心情概览"
          background="#fdf5f5"
          style={{ flex: "1 1 200px" }}   // 👉 允许 card 自适应
        >
          <p style={{ margin: 0, fontSize: 14, color: "#555" }}>
            本月出现次数最多的心情：
          </p>
          <p style={{ margin: 0, fontSize: 16, fontWeight: "bold" }}>
            {moodText}
          </p>
          <p style={{ marginTop: 8, fontSize: 12, color: "#888" }}>
            开心：{moodCounts[MOOD.HAPPY] || 0} 天；
            一般：{moodCounts[MOOD.NORMAL] || 0} 天；
            不太好：{moodCounts[MOOD.SAD] || 0} 天
          </p>
        </StatCard>

        {/* 饼图容器 */}
        <div
          style={{
            flex: "1 1 350px",             // 👉 让它和 StatCard 并排
            padding: 16,
            borderRadius: 12,
            background: "white",
            boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
          }}
        >
          <ReactECharts option={moodOption} style={{ height: 260 }} />
        </div>
      </div>


      {/* AI 情绪建议预留区域 */}
      <div
        style={{
          padding: 16,
          borderRadius: 12,
          background: "#f7f7f7",
          boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>情绪建议（预留 AI 接入区域）</h3>
        <p style={{ fontSize: 14, color: "#555" }}>
          后续可以将本月的 mood 与 moodNote 汇总成提示词，
          调用大模型 API，为你生成本月情绪的疏导与建议。
        </p>
        <button
          type="button"
          disabled
          style={{
            marginTop: 8,
            padding: "6px 12px",
            borderRadius: 6,
            border: "none",
            background: "#ccc",
            color: "white",
            cursor: "not-allowed",
          }}
        >
          敬请期待：向 AI 请求情绪建议
        </button>
      </div>
    </div>
  )
}
