import "./Dashboard.css";

export default function Charts() {
  return (
    <div className="charts-grid">
      <div className="chart-card">
        <h4>📈 Sales Snapshot</h4>
        <p>Orders Trend (Last 7 Days)</p>
        <div className="fake-chart">▇ ▆ ▇ ▅ ▆ ▇ ▆</div>
      </div>

      <div className="chart-card">
        <h4>📦 Inventory Health</h4>
        <p>Overall stock status</p>
        <div className="fake-chart">██████████░ 94%</div>
      </div>
    </div>
  );
}
