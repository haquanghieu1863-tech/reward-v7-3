import { useState } from 'react';import { useAuth } from './useAuth.js'
export default function AuthPanel(){ const { user,loading,login,register,logout }=useAuth(); const [email,setEmail]=useState(''),[pw,setPw]=useState(''),[msg,setMsg]=useState('')
  if(loading) return <div>Đang kiểm tra...</div>
  if(user) return <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{opacity:.9}}>{user.email} • {user.role} • {user.points??0}đ</span><button onClick={logout}>Đăng xuất</button></div>
  return <div style={{display:'flex',gap:6}}><input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/><input type="password" placeholder="Mật khẩu" value={pw} onChange={e=>setPw(e.target.value)}/><button onClick={async()=>{try{await login(email,pw);setMsg('')}catch(e){setMsg(e.message)}}}>Đăng nhập</button><button onClick={async()=>{try{await register(email,pw);setMsg('')}catch(e){setMsg(e.message)}}}>Đăng ký</button>{msg&&<span style={{color:'#f59e0b'}}>{msg}</span>}</div>
}
