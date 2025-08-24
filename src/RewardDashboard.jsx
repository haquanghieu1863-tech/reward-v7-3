export default function RewardDashboard() {
  const box = {
    padding: 16,
    background: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: 12,
    color: '#e2e8f0',
  };

  return (
    <div style={box}>
      <h2 style={{ margin: 0 }}>Bảng điều khiển điểm thưởng</h2>
      <p style={{ opacity: 0.8, marginTop: 8 }}>
        Tổng điểm, bonus, lịch sử xem quảng cáo và phần thưởng.
      </p>
    </div>
  );
}
