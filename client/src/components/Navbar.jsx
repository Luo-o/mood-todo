import {Link} from 'react-router-dom'

export default function Navbar() {
  return (
    <nav style={{
      padding: "10px 20px",
      background: "#23aaf2",
      color: "white",
      display: "flex",
      gap: "20px"
    }}>
      <Link style={{ color: "white" }} to="/today">今日</Link>
      <Link style={{ color: "white" }} to="/calendar">日历</Link>
      <Link style={{ color: "white" }} to="/stats">统计</Link>
    </nav>
  );
}