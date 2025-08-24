import prisma from '../_db.js';import {ok,bad} from '../_json.js';import jwt from 'jsonwebtoken';import {JWT_SECRET} from '../_env.js'
const MIN_WATCH=Number(process.env.MIN_WATCH_SEC||8)
export default async (req,res)=>{ if(req.method!=='POST')return bad(res,405,'Method not allowed')
 try{ const auth=req.headers.authorization||''; const token=auth.replace(/^Bearer\s+/i,''); const u=jwt.verify(token,JWT_SECRET)
  const {adId,watchedSec=0,reward=0}=JSON.parse(req.body||'{}'); if(!adId) return bad(res,400,'Thiếu adId'); if(watchedSec<MIN_WATCH) return bad(res,400,`Chưa đủ thời gian (>=${MIN_WATCH}s)`)
  await prisma.$transaction(async(tx)=>{ await tx.transaction.create({data:{userId:u.uid,type:'ad_view',amount:reward,adId,meta:{watchedSec}}}); await tx.user.update({where:{id:u.uid},data:{points:{increment:reward}}}) })
  return ok(res,{message:'Đã cộng điểm',reward}) } catch(e){ return bad(res,400,e.message||'Bad request') } }