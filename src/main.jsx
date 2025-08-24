// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AdminSettings from './AdminSettings.jsx'

function AdminSettingsPage() {
  const [settings, setSettings] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/settings')
        if (res.ok) {
          const data = await res.json()
          setSettings(data || null)
        } else {
          setSettings(null)
        }
      } catch (e) {
        setSettings(null)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const onSave = async (form) => {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(form),
    })
    if (!res.ok) throw new Error('Lưu thất bại')
    const data = await res.json()
    setSettings(data)
    alert('Đã lưu cấu hình!')
  }

  const onExport = () => {
    const blob = new Blob([JSON.stringify(settings ?? {}, null, 2)], { type: 'application/json'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'settings.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const onImport = async (file) => {
    const text = await file.text()
    const json = JSON.parse(text)
    await onSave(json)
  }

  if (loading) return <div style={{padding:16}}>Đang tải...</div>

  // Nếu chưa có settings ở DB, truyền default rỗng để hiển thị form
  return (
    <div style={{maxWidth:900, margin:'24px auto', color:'#e2e8f0', fontFamily:'sans-serif'}}>
      <AdminSettings
        settings={settings ?? {
          site:{name:'Reward Web', primary:'#d71920', secondary:'#0ea5e9'},
          banner:{enabled:false, title:'', subtitle:'', image:'', ctaText:'', ctaLink:''},
          ads:{autoplay:true, countdown:10, requiredWatchSec:5, list:[]},
          bonus:{enabled:false, showAfter:3, rewards:[]},
          sfx:{enabled:true, volume:0.5},
          backend:{enabled:true},
        }}
        onSave={onSave}
        onImport={onImport}
        onExport={onExport}
      />
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
if (window.location.pathname === '/admin-settings') {
  root.render(<AdminSettingsPage />)
} else {
  root.render(<App />)
}
