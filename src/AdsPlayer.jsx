import { useEffect, useRef, useState } from 'react'
import CircularCountdown from './CircularCountdown.jsx'
import Fireworks from './Fireworks.jsx'
import BonusWheel from './BonusWheel.jsx'
import { playTing, playWoosh } from './sfx.js'

export default function AdsPlayer({ settings }){
  const ads=settings?.ads?.list||[], baseCountdown=settings?.ads?.countdown??10, reqWatch=settings?.ads?.requiredWatchSec??baseCountdown, autoplay=!!settings?.ads?.autoplay
  const sfxEnabled=!!settings?.sfx?.enabled, sfxVol=settings?.sfx?.volume??.5, backendOn=!!settings?.backend?.enabled
  const bonus=settings?.bonus||{enabled:false,showAfter:3,rewards:[5,10,20]}
  const [idx,setIdx]=useState(0),[paused,setPaused]=useState(false),[resetKey,setResetKey]=useState(0),[watchSec,setWatchSec]=useState(0),[showFx,setShowFx]=useState(false),[showWheel,setShowWheel]=useState(false),[msg,setMsg]=useState(''),[countdown,setCountdown]=useState(baseCountdown)
  const containerRef=useRef(null),visibleRef=useRef(true),hoverRef=useRef(false),focusRef=useRef(true),tickRef=useRef(null)

  useEffect(()=>{ const el=containerRef.current
    const vis=()=>{ const hidden=document.hidden; setPaused(hidden||!visibleRef.current) }; document.addEventListener('visibilitychange',vis)
    const onFocus=()=>{ focusRef.current=true; setPaused(document.hidden||!visibleRef.current) }, onBlur=()=>{ focusRef.current=false; setPaused(true) }
    window.addEventListener('focus',onFocus); window.addEventListener('blur',onBlur)
    const io=new IntersectionObserver(([e])=>{ const inView=e?.isIntersecting; visibleRef.current=!!inView; setPaused(document.hidden||!inView) },{threshold:.6})
    if(el) io.observe(el)
    const enter=()=>{ hoverRef.current=true }, leave=()=>{ hoverRef.current=false }; el?.addEventListener('pointerenter',enter); el?.addEventListener('pointerleave',leave)
    tickRef.current=setInterval(()=>{ if(!paused && hoverRef.current && focusRef.current && visibleRef.current){ setWatchSec(s=>s+.25) } },250)
    return()=>{ document.removeEventListener('visibilitychange',vis); window.removeEventListener('focus',onFocus); window.removeEventListener('blur',onBlur); el?.removeEventListener('pointerenter',enter); el?.removeEventListener('pointerleave',leave); io.disconnect(); clearInterval(tickRef.current) }
  },[idx,paused])
  useEffect(()=>{ setPaused(!autoplay) },[autoplay])
  if(!ads.length) return <div style={{opacity:.8}}>Chưa có quảng cáo</div>
  const ad=ads[idx]
  const restartFor=(sec)=>{ setCountdown(sec); setWatchSec(0); setMsg(''); setResetKey(k=>k+1); setPaused(false) }
  const afterComplete=async()=>{ const token=localStorage.getItem('rw_token'); if(backendOn && token){ try{ await fetch('/api/ads.complete',{method:'POST',headers:{Authorization:`Bearer ${token}`},body:JSON.stringify({adId:ad.id,watchedSec:Math.round(watchSec),reward:ad.reward})}) }catch(e){ console.warn('complete failed',e) } }
    playTing(sfxEnabled,sfxVol); setShowFx(true); setTimeout(()=>{ setShowFx(false); setIdx(i=>(i+1)%ads.length); restartFor(baseCountdown) },1200) }
  const onDone=()=>{ if(watchSec+0.001<reqWatch){ const need=Math.max(1,Math.ceil(reqWatch-watchSec)); setMsg(`Hãy ở trong khung thêm ${need}s để nhận thưởng`); playWoosh(sfxEnabled,sfxVol); restartFor(need); return } afterComplete() }
  return (<div ref={containerRef} style={{border:'1px solid #1e293b',borderRadius:12,overflow:'hidden',position:'relative'}}>
    <div style={{display:'flex',justifyContent:'space-between',padding:8,background:'#0f172a',alignItems:'center'}}>
      <div>Quảng cáo: <b>{ad.id}</b> — +{ad.reward} điểm</div>
      <div style={{display:'flex',alignItems:'center',gap:10}}><CircularCountdown seconds={countdown} paused={paused} resetKey={resetKey} onDone={onDone}/></div>
    </div>
    {ad.type==='image' && (<img src={ad.src} alt={ad.id} style={{width:'100%',height:360,objectFit:'cover',display:'block'}}/>)}
    <div style={{padding:8,background:'#0f172a',display:'flex',gap:8,alignItems:'center'}}>
      <button onClick={()=>{ setIdx((idx-1+ads.length)%ads.length); restartFor(baseCountdown) }}>&lt; Trước</button>
      <button onClick={()=>{ setIdx((idx+1)%ads.length); restartFor(baseCountdown) }}>Sau &gt;</button>
      <span style={{opacity:.8}}>Đã ở trong khung: {Math.floor(watchSec)}s / yêu cầu {reqWatch}s</span>
      {paused && <span style={{color:'#f59e0b',fontWeight:700}}>Tạm dừng (ẩn tab / rời khung)</span>}
      {msg && <span style={{color:'#ffd700',fontWeight:700}}>{msg}</span>}
    </div>
    {showFx && (<div style={{position:'absolute',left:0,right:0,bottom:42}}><Fireworks/></div>)}
  </div>) }