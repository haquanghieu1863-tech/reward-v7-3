import { useEffect, useRef, useState } from 'react'; const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x))
export default function CircularCountdown({ seconds=10, paused=false, resetKey=0, onDone }){
  const [elapsed,setElapsed]=useState(0); const raf=useRef(null); const anchor=useRef(0)
  useEffect(()=>{ setElapsed(0) },[seconds,resetKey])
  useEffect(()=>{ cancelAnimationFrame(raf.current); if(paused) return; anchor.current=performance.now()-elapsed*1000
    const loop=(t)=>{ const e=(t-anchor.current)/1000; setElapsed(e); if(e>=seconds){ onDone&&onDone(); return } raf.current=requestAnimationFrame(loop) }
    raf.current=requestAnimationFrame(loop); return ()=>cancelAnimationFrame(raf.current) },[paused,seconds,resetKey]) // eslint-disable-line
  const r=22,stroke=6,C=2*Math.PI*r,p=clamp(elapsed/seconds),dash=C*(1-p),hue=120-120*p
  return (<div style={{position:'relative',width:60,height:60}}><svg width="60" height="60" viewBox="0 0 60 60" style={{transform:'rotate(-90deg)'}}>
    <circle cx="30" cy="30" r={r} fill="none" stroke="#1f2937" strokeWidth={stroke}/>
    <circle cx="30" cy="30" r={r} fill="none" stroke={`hsl(${hue}deg 90% 50%)`} strokeWidth={stroke} strokeDasharray={C} strokeDashoffset={dash} strokeLinecap="round"/></svg>
    <div style={{position:'absolute',inset:0,display:'grid',placeItems:'center',fontWeight:800,color:'#e5e7eb'}}>{Math.ceil(seconds-elapsed)}s</div></div>)
}