import { useRef, useState } from 'react'
export default function AdminSettings({ settings, onSave, onImport, onExport }){
  const [form,setForm]=useState(settings); const fileRef=useRef(null)
  const set=(path,val)=>{ const parts=path.split('.'); const next={...form}; let cur=next; for(let i=0;i<parts.length-1;i++){ const k=parts[i]; cur[k]={...(cur[k]||{})}; cur=cur[k] } cur[parts.at(-1)]=val; setForm(next) }
  const row=(label,children)=>(<div style={{display:'grid',gridTemplateColumns:'180px 1fr',gap:12,alignItems:'center',marginBottom:10}}><div style={{opacity:.8}}>{label}</div><div>{children}</div></div>)
  return (<div style={{padding:16,background:'#0f172a',border:'1px solid #1e293b',borderRadius:12}}>
    <h3 style={{marginTop:0}}>Cấu hình hệ thống</h3>
    <section style={{borderTop:'1px solid #1e293b',paddingTop:12}}><h4>Site</h4>
      {row('Tên site',<input value={form.site.name} onChange={e=>set('site.name',e.target.value)}/>)}
      {row('Màu chính',<input value={form.site.primary} onChange={e=>set('site.primary',e.target.value)}/>)}
      {row('Màu phụ',<input value={form.site.secondary} onChange={e=>set('site.secondary',e.target.value)}/>)}
    </section>
    <section style={{borderTop:'1px solid #1e293b',paddingTop:12}}><h4>Banner</h4>
      {row('Bật banner',<input type="checkbox" checked={form.banner.enabled} onChange={e=>set('banner.enabled',e.target.checked)}/>)}
      {row('Tiêu đề',<input value={form.banner.title} onChange={e=>set('banner.title',e.target.value)}/>)}
      {row('Phụ đề',<input value={form.banner.subtitle} onChange={e=>set('banner.subtitle',e.target.value)}/>)}
      {row('Ảnh URL',<input value={form.banner.image} onChange={e=>set('banner.image',e.target.value)}/>)}
      {row('CTA text',<input value={form.banner.ctaText} onChange={e=>set('banner.ctaText',e.target.value)}/>)}
      {row('CTA link',<input value={form.banner.ctaLink} onChange={e=>set('banner.ctaLink',e.target.value)}/>)}
    </section>
    <section style={{borderTop:'1px solid #1e293b',paddingTop:12}}><h4>Quảng cáo</h4>
      {row('Autoplay',<input type="checkbox" checked={form.ads.autoplay} onChange={e=>set('ads.autoplay',e.target.checked)}/>)}
      {row('Countdown (s)',<input type="number" min="3" max="120" value={form.ads.countdown} onChange={e=>set('ads.countdown',parseInt(e.target.value||'0',10))}/>)}
      {row('Yêu cầu ở trong khung (s)',<input type="number" min="1" max="120" value={form.ads.requiredWatchSec} onChange={e=>set('ads.requiredWatchSec',parseInt(e.target.value||'0',10))}/>)}
      <div style={{marginTop:10}}><div style={{opacity:.8,marginBottom:6}}>Danh sách Ads (JSON)</div>
        <textarea style={{width:'100%',minHeight:120}} value={JSON.stringify(form.ads.list,null,2)} onChange={e=>{try{set('ads.list',JSON.parse(e.target.value))}catch{}}}/>
      </div>
    </section>
    <section style={{borderTop:'1px solid #1e293b',paddingTop:12}}><h4>Bonus</h4>
      {row('Bật bonus',<input type="checkbox" checked={form.bonus.enabled} onChange={e=>set('bonus.enabled',e.target.checked)}/>)}
      {row('Sau mỗi N quảng cáo',<input type="number" min="1" max="20" value={form.bonus.showAfter} onChange={e=>set('bonus.showAfter',parseInt(e.target.value||'0',10))}/>)}
      <div style={{marginTop:10}}><div style={{opacity:.8,marginBottom:6}}>Rewards (JSON)</div>
        <textarea style={{width:'100%',minHeight:80}} value={JSON.stringify(form.bonus.rewards,null,2)} onChange={e=>{try{set('bonus.rewards',JSON.parse(e.target.value))}catch{}}}/>
      </div>
    </section>
    <section style={{borderTop:'1px solid #1e293b',paddingTop:12}}><h4>Âm thanh</h4>
      {row('Bật SFX',<input type="checkbox" checked={form.sfx.enabled} onChange={e=>set('sfx.enabled',e.target.checked)}/>)}
      {row('Âm lượng',<input type="number" min="0" max="1" step="0.05" value={form.sfx.volume} onChange={e=>set('sfx.volume',parseFloat(e.target.value||'0'))}/>)}
    </section>
    <section style={{borderTop:'1px solid #1e293b',paddingTop:12}}><h4>Backend</h4>
      {row('Bật backend (DB)',<input type="checkbox" checked={form.backend.enabled} onChange={e=>set('backend.enabled',e.target.checked)}/>)}
    </section>
    <div style={{display:'flex',gap:8,marginTop:8}}>
      <button onClick={()=>onSave(form)}>Lưu cấu hình</button>
      <button onClick={()=>onExport()}>Xuất JSON</button>
      <button onClick={()=>document.getElementById('fileJSON').click()}>Nhập JSON</button>
      <input id="fileJSON" type="file" accept="application/json" style={{display:'none'}} onChange={async e=>{ const f=e.target.files?.[0]; if(!f) return; await onImport(f) }}/>
    </div>
  </div>)
}
