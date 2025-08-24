import { useEffect, useState } from 'react'
const LS='rw_settings_v2'
export function useSettings(){
  const [settings,setSettings]=useState(null),[loading,setLoading]=useState(true),[error,setError]=useState('')
  const load=async()=>{ setLoading(true); setError(''); try{ const r=await fetch('/api/settings'); if(!r.ok) throw new Error('http '+r.status); const j=await r.json(); setSettings(j.settings); localStorage.setItem(LS,JSON.stringify(j.settings)) }catch(e){ const raw=localStorage.getItem(LS); if(raw) setSettings(JSON.parse(raw)); setError(e.message) } finally{ setLoading(false) } }
  useEffect(()=>{ load() },[])
  const save=async(next)=>{ setSettings(next); try{ const r=await fetch('/api/settings',{method:'PUT',body:JSON.stringify({settings:next})}); if(!r.ok) throw new Error('save '+r.status); const j=await r.json(); setSettings(j.settings); localStorage.setItem(LS,JSON.stringify(j.settings)) }catch(e){ localStorage.setItem(LS,JSON.stringify(next)); console.warn('Saved to LS fallback',e) } }
  const exportJSON=()=>{ if(!settings) return; const blob=new Blob([JSON.stringify(settings,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='reward-settings.json'; a.click(); URL.revokeObjectURL(url) }
  const importJSON=file=>new Promise((res,rej)=>{ const rd=new FileReader(); rd.onload=async()=>{ try{ const data=JSON.parse(rd.result); await save(data); res(true) }catch(e){ rej(e) } }; rd.onerror=rej; rd.readAsText(file) })
  return { settings,loading,error,save,exportJSON,importJSON,reload:load }
}
