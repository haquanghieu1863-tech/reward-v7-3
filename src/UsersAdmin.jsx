import { useEffect, useState } from 'react'; import { useAuth } from './useAuth.js'
export default function UsersAdmin(){ const { token,user }=useAuth(); const [list,setList]=useState([]),[q,setQ]=useState(''),[page,setPage]=useState(1),[total,setTotal]=useState(0),[size,setSize]=useState(10),[txs,setTxs]=useState([]),[txUser,setTxUser]=useState(null)
  const isAdmin=user?.role==='admin'
  const load=async()=>{ if(!isAdmin) return; const r=await fetch(`/api/users.list?q=${encodeURIComponent(q)}&page=${page}&pageSize=${size}`,{headers:{Authorization:`Bearer ${token}`}}); const j=await r.json(); if(j.ok){ setList(j.items); setTotal(j.total) } }
  useEffect(()=>{ load() },[q,page,size,token])
  const pages=Math.max(1,Math.ceil(total/size))
  const updateUser=async(u,{deltaPoints,setPoints,role})=>{ const body={userId:u.id}; if(typeof deltaPoints==='number') body.deltaPoints=deltaPoints; if(typeof setPoints==='number') body.setPoints=setPoints; if(role) body.role=role
    const r=await fetch('/api/users.update',{method:'POST',headers:{Authorization:`Bearer ${token}`},body:JSON.stringify(body)}); const j=await r.json(); if(j.ok) load(); else alert(j.message||'Update failed') }
  const viewTxs=async(u)=>{ const r=await fetch(`/api/users.txs?userId=${u.id}`,{headers:{Authorization:`Bearer ${token}`}}); const j=await r.json(); if(j.ok){ setTxs(j.items); setTxUser(u) } }
  if(!isAdmin) return <div style={{padding:16}}>Chỉ admin mới xem được trang này.</div>
  return (<div style={{padding:16,background:'#0f172a',border:'1px solid #1e293b',borderRadius:12}}>
    <h3>Quản lý người dùng</h3>
    <div style={{display:'flex',gap:8,marginBottom:8}}><input placeholder="Tìm email..." value={q} onChange={e=>setQ(e.target.value)}/>
      <select value={size} onChange={e=>setSize(parseInt(e.target.value,10))}>{[10,20,50].map(n=><option key={n} value={n}>{n}/trang</option>)}</select>
      <button onClick={load}>Tải lại</button>
    </div>
    <div style={{overflow:'auto'}}><table><thead><tr><th>Email</th><th>Role</th><th>Points</th><th>Created</th><th>Thao tác</th></tr></thead><tbody>
      {list.map(u=>(<tr key={u.id}><td>{u.email}</td><td><select value={u.role} onChange={e=>updateUser(u,{role:e.target.value})}><option value="user">user</option><option value="admin">admin</option></select></td>
      <td>{u.points}</td><td>{new Date(u.createdAt).toLocaleString()}</td><td style={{display:'flex',gap:6}}>
        <button onClick={()=>updateUser(u,{deltaPoints:5})}>+5</button><button onClick={()=>updateUser(u,{deltaPoints:-5})}>-5</button>
        <button onClick={()=>{ const p=prompt('Set points = ?', String(u.points)); if(p!=null) updateUser(u,{setPoints:parseInt(p,10)}) }}>Set</button>
        <button onClick={()=>viewTxs(u)}>Lịch sử</button></td></tr>))}
    </tbody></table></div>
    <div style={{display:'flex',gap:8,marginTop:8}}><button disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Trước</button><span>Trang {page}/{pages}</span><button disabled={page>=pages} onClick={()=>setPage(p=>p+1)}>Sau</button></div>
    {txUser&&(<div style={{marginTop:12,padding:12,background:'#111827',borderRadius:8}}><h4>Lịch sử — {txUser.email}</h4><table><thead><tr><th>Loại</th><th>Điểm</th><th>Ad</th><th>Meta</th><th>Thời gian</th></tr></thead><tbody>
      {txs.map(t=>(<tr key={t.id}><td>{t.type}</td><td>{t.amount}</td><td>{t.adId||''}</td><td><pre style={{margin:0,whiteSpace:'pre-wrap'}}>{JSON.stringify(t.meta||{},null,0)}</pre></td><td>{new Date(t.createdAt).toLocaleString()}</td></tr>))}
    </tbody></table><div style={{marginTop:8}}><button onClick={()=>{ setTxUser(null); setTxs([]) }}>Đóng</button></div></div>)}
  </div>)
}
