import { useState } from 'react'
const TEMPLATES={
  Hero:{type:'Hero',props:{title:'Tiêu đề',subtitle:'Mô tả',image:''}},
  Text:{type:'Text',props:{text:'Nhập nội dung...'}},
  AdsList:{type:'AdsList',props:{}},
  ButtonRow:{type:'ButtonRow',props:{buttons:[{label:'Nút',href:'#'}]}},
  Spacer:{type:'Spacer',props:{height:16}},
  TableBlock:{type:'TableBlock',props:{columns:['Cột A','Cột B'],rows:[['Giá trị 1','Giá trị 2']]}},
  QnABlock:{type:'QnABlock',props:{items:[{q:'Câu hỏi?',a:'Câu trả lời.'}]}},
  TaskListBlock:{type:'TaskListBlock',props:{items:[{title:'Nhiệm vụ',desc:'Mô tả',reward:5}]}},
  CustomLinksBlock:{type:'CustomLinksBlock',props:{links:[{label:'Facebook',href:'https://facebook.com',icon:'🔗'}]}},
  GameEmbedBlock:{type:'GameEmbedBlock',props:{title:'Mini Game',src:'',height:420,sandbox:true,allow:'',raw:''}},
}
const PAGE_OPTIONS=['home','tasks','leaderboard','faq','withdraw']
export default function AdminPageBuilder({ settings, onSave }){
  const [pageName,setPageName]=useState('home'); const [pages,setPages]=useState(settings.pages||{}); const page=pages[pageName]||{blocks:[TEMPLATES.Hero]}
  const setPage=(next)=>setPages(p=>({...p,[pageName]:next}))
  const addBlock=(type)=>setPage({...page,blocks:[...(page.blocks||[]),JSON.parse(JSON.stringify(TEMPLATES[type]))]})
  const updateProp=(i,key,val)=>setPage({...page,blocks:page.blocks.map((b,idx)=> idx===i?({...b,props:{...(b.props||{}),[key]:val}}):b)})
  const remove=(i)=>setPage({...page,blocks:page.blocks.filter((_,idx)=>idx!==i)})
  const move=(i,dir)=>{const arr=[...(page.blocks||[])];const j=i+dir;if(j<0||j>=arr.length)return;[arr[i],arr[j]]=[arr[j],arr[i]];setPage({...page,blocks:arr})}
  const saveAll=async()=>{ const next={...(settings||{}),pages}; await onSave(next) }
  return (<div style={{padding:16,background:'#0f172a',border:'1px solid #1e293b',borderRadius:12}}>
    <h3 style={{marginTop:0}}>Page Builder – Đa trang</h3>
    <div style={{display:'flex',gap:8,alignItems:'center',margin:'8px 0 12px'}}>
      <div>Trang:</div><select value={pageName} onChange={e=>setPageName(e.target.value)}>{PAGE_OPTIONS.map(p=><option key={p} value={p}>{p}</option>)}</select>
      <button onClick={saveAll}>Lưu trang</button>
    </div>
    <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:12}}>{Object.keys(TEMPLATES).map(t=><button key={t} onClick={()=>addBlock(t)}>{t}</button>)}</div>
    <div style={{display:'grid',gap:12}}>
      {(page.blocks||[]).map((blk,i)=>(<div key={i} style={{border:'1px solid #334155',borderRadius:10,padding:12,background:'#111827'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><strong>{i+1}. {blk.type}</strong>
          <div style={{display:'flex',gap:6}}><button onClick={()=>move(i,-1)}>▲</button><button onClick={()=>move(i,1)}>▼</button><button onClick={()=>remove(i)} style={{color:'#f87171'}}>X</button></div>
        </div>
        <div style={{marginTop:8}}>
          {Object.entries(blk.props||{}).map(([k,v])=>(<div key={k} style={{display:'grid',gridTemplateColumns:'180px 1fr',gap:8,marginBottom:8}}>
            <label>{k}</label>
            <input value={typeof v==='string'?v:JSON.stringify(v)} onChange={e=>{ let val=e.target.value; try{ if(val.trim().startsWith('[')||val.trim().startsWith('{')) val=JSON.parse(val) }catch{} updateProp(i,k,val) }}/>
          </div>))}
        </div>
      </div>))}
    </div>
  </div>)
}
