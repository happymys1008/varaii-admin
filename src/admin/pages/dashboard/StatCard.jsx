import "./StatCard.css";

export default function StatCard({ title, value, sub, color, onClick }) {
  return (
    <div
      className={`stat-card ${color}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <h4>{title}</h4>
      <h1>{value}</h1>
      <span>{sub}</span>
    </div>
  );
}
