import { useEffect, useState } from 'react'
const KEY='rw_token'
export function useAuth(){
  const [token,setToken]=useState(localStorage.getItem(KEY)||''),[user,setUser]=useState(null),[loading,setLoading]=useState(!!token),[error,setError]=useState('')
  const save=(t)=>{ setToken(t||''); if(t)localStorage.setItem(KEY,t); else localStorage.removeItem(KEY) }
  const me=async()=>{ if(!token){ setUser(null); return } try{ setLoading(true); const r=await fetch('/api/auth.me',{headers:{Authorization:`Bearer ${token}`}}); const j=await r.json(); if(!j.ok) throw new Error(j.message||'auth'); setUser(j.user) }catch(e){ setError(e.message); setUser(null) } finally{ setLoading(false) } }
  useEffect(()=>{ me() },[token])
  const login=async(email,password)=>{ const r=await fetch('/api/auth.login',{method:'POST',body:JSON.stringify({email,password})}); const j=await r.json(); if(!j.ok) throw new Error(j.message||'login'); save(j.token); setUser(j.user); return j.user }
  const register=async(email,password)=>{ const r=await fetch('/api/auth.register',{method:'POST',body:JSON.stringify({email,password})}); const j=await r.json(); if(!j.ok) throw new Error(j.message||'register'); return await login(email,password) }
  const logout=()=>{ save(''); setUser(null) }
  return { token,user,loading,error,login,register,logout,me }
}
