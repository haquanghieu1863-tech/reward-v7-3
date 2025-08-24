import React, { useEffect, useState, Suspense } from 'react'
import { useSettings } from './useSettings.js'
import { useAuth } from './useAuth.js'
import AuthPanel from './AuthPanel.jsx'
import Banner from './Banner.jsx'
import { PageRenderer } from './ComponentRegistry.jsx'
import RewardDashboard from './RewardDashboard.jsx'
import Feed from './Feed.jsx'
import AdminAdsPanel from './AdminAdsPanel.jsx'
import AdminWithdraws from './AdminWithdraws.jsx'
import Withdraw from './Withdraw.jsx'
import UsersAdmin from './UsersAdmin.jsx'

export default function App(){
  const { settings, loading, error, save, exportJSON, importJSON, reload } = useSettings()
  const { user } = useAuth()
  const [tab,setTab]=useState('home')
  useEffect(()=>{ const hash=new URLSearchParams(window.location.hash.replace(/^#/,'')); const t=hash.get('tab'); if(t) setTab(t) },[])
  if(loading) return <div style={{padding:16}}>Đang tải cấu hình...</div>
  if(!settings) return <div style={{padding:16}}>Chưa có cấu hình. Hãy vào admin-settings để lưu lần đầu.</div>

  const tabs=[
    {id:'home',label:'home'},
    {id:'tasks',label:'tasks'},
    {id:'leaderboard',label:'leaderboard'},
    {id:'faq',label:'faq'},
    {id:'dashboard',label:'dashboard'},
    {id:'feed',label:'feed'},
    {id:'withdraw',label:'withdraw'},
    {id:'admin-ads',label:'admin-ads'},
    {id:'admin-settings',label:'admin-settings'},
    {id:'admin-page-builder',label:'admin-page-builder'},
    {id:'admin-users',label:'admin-users'},
  ]

  const AdminSettings = React.lazy(()=>import('./AdminSettings.jsx'))
  const AdminPageBuilder = React.lazy(()=>import('./AdminPageBuilder.jsx'))

  return (<div style={{minHeight:'100vh',background:'#0b1220',color:'#eaf2ff',fontFamily:'system-ui,-apple-system,Segoe UI,Roboto,Arial'}}>
    <header style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',borderBottom:'1px solid #1e293b'}}>
      <strong style={{color: settings.site.primary}}>{settings.site.name}</strong>
      <nav style={{display:'flex',gap:8,marginLeft:12,flexWrap:'wrap'}}>
        {tabs.map(t=>(<button key={t.id} onClick={()=>setTab(t.id)} style={{padding:'6px 10px',background:tab===t.id?'#1f2937':'#111827',border:'1px solid #334155',borderRadius:8,color:'#e5e7eb',cursor:'pointer'}}>{t.label}</button>))}
      </nav>
      <div style={{flex:1}}/>
      <AuthPanel/>
    </header>

    <main style={{padding:16}}>
      <Banner settings={settings}/>
      {tab==='home' && <PageRenderer page={settings.pages?.home || {blocks:[]}} settings={settings}/>}
      {tab==='tasks' && <PageRenderer page={settings.pages?.tasks || {blocks:[]}} settings={settings}/>}
      {tab==='leaderboard' && <PageRenderer page={settings.pages?.leaderboard || {blocks:[]}} settings={settings}/>}
      {tab==='faq' && <PageRenderer page={settings.pages?.faq || {blocks:[]}} settings={settings}/>}
      {tab==='dashboard' && <RewardDashboard/>}
      {tab==='feed' && <Feed/>}
      {tab==='withdraw' && <Withdraw/>}
      {tab==='admin-ads' && <AdminAdsPanel/>}
      {tab==='admin-settings' && (<Suspense fallback={<div>Đang tải...</div>}>
          <AdminSettings settings={settings} onSave={save} onExport={exportJSON} onImport={importJSON} />
        </Suspense>)}
      {tab==='admin-page-builder' && (<Suspense fallback={<div>Đang tải...</div>}>
          <AdminPageBuilder settings={settings} onSave={save} />
        </Suspense>)}
      {tab==='admin-users' && (user?.role==='admin' ? <UsersAdmin/> : <div>Bạn không có quyền.</div>)}
      <div style={{opacity:.6, marginTop:16}}>API: {error ? 'fallback localStorage' : 'DB-backed settings'}</div>
      <button onClick={reload} style={{marginTop:8}}>Reload settings</button>
    </main>
  </div>)
}
