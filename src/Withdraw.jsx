export default function Withdraw() {
  const box = {
    padding: 16,
    background: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: 12,
    color: '#e2e8f0',
  };

  return (
    <div style={box}>
      <h2 style={{ margin: 0 }}>Rút tiền</h2>
      <p style={{ opacity: 0.8, marginTop: 8 }}>
        Điền thông tin & tạo yêu cầu rút (được admin duyệt).
      </p>
    </div>
  );
}
