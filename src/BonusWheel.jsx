import { useState } from 'react'
export default function BonusWheel({rewards=[5,10,20],onResult,onClose}){ const [spin,setSpin]=useState(0),[running,setRunning]=useState(false); const size=260,parts=rewards.length
  const start=()=>{ if(running) return; setRunning(true); const win=Math.floor(Math.random()*parts),degPer=360/parts,target=360*3+(360-(win*degPer+degPer/2)); setSpin(target); setTimeout(()=>{ setRunning(false); onResult&&onResult(rewards[win]) },2600) }
  return (<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.65)',display:'grid',placeItems:'center',zIndex:1000}} onClick={e=>{if(e.target===e.currentTarget) onClose&&onClose()}}>
    <div style={{position:'relative',padding:16,background:'#0f172a',border:'1px solid #1e293b',borderRadius:16}}>
      <div style={{position:'absolute',left:'50%',top:-8,transform:'translateX(-50%)',width:0,height:0,borderLeft:'12px solid transparent',borderRight:'12px solid transparent',borderBottom:'16px solid #ffd700'}}/>
      <div style={{width:size,height:size,borderRadius:'50%',border:'6px solid #334155',overflow:'hidden',transform:`rotate(${spin}deg)`,transition:'transform 2.6s cubic-bezier(.2,.8,.2,1)'}}>
        {rewards.map((r,i)=>(<div key={i} style={{position:'absolute',inset:0,clipPath:'polygon(50% 50%, 0 0, 100% 0)',transform:`rotate(${i*360/parts}deg)`,background:i%2?'#7c2d12':'#9a3412',color:'#fff'}}>
          <div style={{position:'absolute',left:'50%',top:8,transform:`translateX(-50%) rotate(${90 - i*360/parts}deg)`,fontWeight:800}}>+{r}</div></div>))}
      </div>
      <div style={{display:'flex',justifyContent:'center',gap:8,marginTop:12}}><button onClick={start} disabled={running} style={{fontWeight:800}}>Quay thưởng</button><button onClick={onClose}>Đóng</button></div>
    </div></div>) }