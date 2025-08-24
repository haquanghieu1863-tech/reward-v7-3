import prisma from '../_db.js';import {ok,bad} from '../_json.js';import jwt from 'jsonwebtoken';import {JWT_SECRET} from '../_env.js'
export default async (req,res)=>{ if(req.method!=='POST')return bad(res,405,'Method not allowed')
 try{ const auth=req.headers.authorization||''; const token=auth.replace(/^Bearer\s+/i,''); const me=jwt.verify(token,JWT_SECRET)
  const meUser=await prisma.user.findUnique({where:{id:me.uid}}); if(!meUser||meUser.role!=='admin') return bad(res,403,'Forbidden')
  const {userId,deltaPoints,setPoints,role}=JSON.parse(req.body||'{}'); if(!userId) return bad(res,400,'Thiếu userId')
  if(typeof role==='string'){ await prisma.user.update({where:{id:userId},data:{role}}) }
  if(typeof deltaPoints==='number' && deltaPoints!==0){ await prisma.$transaction(async(tx)=>{ await tx.transaction.create({data:{userId,type:'bonus',amount:deltaPoints,meta:{reason:'admin_adjust'}}}); await tx.user.update({where:{id:userId},data:{points:{increment:deltaPoints}}}) }) }
  if(typeof setPoints==='number'){ const u=await prisma.user.findUnique({where:{id:userId}}); const diff=setPoints-(u?.points||0); await prisma.$transaction(async(tx)=>{ await tx.transaction.create({data:{userId,type:'bonus',amount:diff,meta:{reason:'admin_set'}}}); await tx.user.update({where:{id:userId},data:{points:setPoints}}) }) }
  return ok(res,{message:'Updated'}) } catch(e){ return bad(res,400,e.message||'Bad request') } }