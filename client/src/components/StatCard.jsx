export default function StatCard({ 
  title, 
  description, 
  children,
  backgroundColor, 
  style = {},
}) {
  return (
    <div
      style={{
        flex: "1 1 240px",
        padding: 16,
        borderRadius: 12,
        background: backgroundColor,
        boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
        ...style,
      }}
    >
      {title && (
        <h3 style={{ margin: 0, marginBottom: 8 }}>
          {title}
        </h3>
      )}

      {description && (
        <p style={{ margin: 0, marginBottom: 8, fontSize: 14, color: "#555" }}>
          {description}
        </p>
      )}

      {/* 内容插槽 */}
      {children}
    </div>
  )
}