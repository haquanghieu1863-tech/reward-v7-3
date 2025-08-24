import prisma from '../_db.js';import {ok,bad} from '../_json.js'
const DEFAULT_SETTINGS={
  site:{name:'Reward Web',primary:'#d71920',secondary:'#ffd700'},
  banner:{enabled:true,title:'Chào mừng Quốc khánh 2/9',subtitle:'Xem quảng cáo – Nhận thưởng lớn!',image:'https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg',effect:'fireworks',ctaText:'Bắt đầu kiếm điểm',ctaLink:'#earn'},
  ads:{autoplay:true,countdown:12,requiredWatchSec:10,list:[
    {id:'ad1',type:'image',src:'https://picsum.photos/seed/1/1200/600',reward:5},
    {id:'ad2',type:'image',src:'https://picsum.photos/seed/2/1200/600',reward:7}]},
  bonus:{enabled:true,showAfter:3,rewards:[5,10,20]},
  sfx:{enabled:true,volume:.6}, backend:{enabled:true},
  pages:{
    home:{blocks:[
      {type:'Hero',props:{title:'Chào mừng Quốc khánh 2/9',subtitle:'Ưu đãi dịp lễ',image:'https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg'}},
      {type:'CustomLinksBlock',props:{links:[{label:'Nhận thưởng',href:'#earn',icon:'🎁'},{label:'Rút tiền',href:'#withdraw',icon:'💸'}]}},
      {type:'AdsList',props:{}}
    ]},
    tasks:{blocks:[{type:'TaskListBlock',props:{items:[{title:'Đăng nhập mỗi ngày',reward:2},{title:'Xem 5 quảng cáo',reward:10}]}}]},
    leaderboard:{blocks:[{type:'TableBlock',props:{columns:['Email','Điểm'],rows:[['demo@example.com','100']]}}]},
    faq:{blocks:[{type:'QnABlock',props:{items:[{q:'Cách nhận thưởng?',a:'Xem quảng cáo đủ thời gian và quay bonus.'}]}}]},
    withdraw:{blocks:[{type:'Text',props:{text:'Mục rút tiền sẽ cập nhật.'}}]}
  }
}
export default async (req,res)=>{
  const id='default'
  if(req.method==='GET'){ let s=await prisma.settings.findUnique({where:{id}}); if(!s){ s=await prisma.settings.create({data:{id,data:DEFAULT_SETTINGS}}) } return ok(res,{settings:s.data}) }
  if(req.method==='PUT'){ try{ const body=JSON.parse(req.body||'{}'); const data=body.settings||body; await prisma.settings.upsert({where:{id},update:{data},create:{id,data}}); return ok(res,{settings:data}) }catch(e){ return bad(res,400,e.message) } }
  return bad(res,405,'Method not allowed')
}
