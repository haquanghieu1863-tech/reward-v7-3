export default function AdminWithdraws() {
  const box = {
    padding: 16,
    background: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: 12,
    color: '#e2e8f0',
  };

  return (
    <div style={box}>
      <h2 style={{ margin: 0 }}>Admin • Rút tiền</h2>
      <p style={{ opacity: 0.8, marginTop: 8 }}>
        Duyệt yêu cầu rút, xem lịch sử giao dịch, khóa/mở người dùng.
      </p>
    </div>
  );
}
