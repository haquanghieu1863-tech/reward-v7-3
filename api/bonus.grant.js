import prisma from '../_db.js';import {ok,bad} from '../_json.js';import jwt from 'jsonwebtoken';import {JWT_SECRET} from '../_env.js'
export default async (req,res)=>{ if(req.method!=='POST')return bad(res,405,'Method not allowed')
 try{ const auth=req.headers.authorization||''; const token=auth.replace(/^Bearer\s+/i,''); const u=jwt.verify(token,JWT_SECRET)
  const {reward=0}=JSON.parse(req.body||'{}'); if(!Number.isFinite(reward)||reward<=0) return bad(res,400,'Reward không hợp lệ')
  await prisma.$transaction(async(tx)=>{ await tx.transaction.create({data:{userId:u.uid,type:'bonus',amount:reward,meta:{}}}); await tx.user.update({where:{id:u.uid},data:{points:{increment:reward}}}) })
  return ok(res,{message:'Đã cộng bonus',reward}) } catch(e){ return bad(res,400,e.message||'Bad request') } }