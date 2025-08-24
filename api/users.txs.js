import prisma from '../_db.js';import {ok,bad} from '../_json.js';import jwt from 'jsonwebtoken';import {JWT_SECRET} from '../_env.js'
export default async (req,res)=>{ try{ const auth=req.headers.authorization||''; const token=auth.replace(/^Bearer\s+/i,''); const me=jwt.verify(token,JWT_SECRET)
 const meUser=await prisma.user.findUnique({where:{id:me.uid}}); if(!meUser||meUser.role!=='admin') return bad(res,403,'Forbidden')
 const url=new URL(req.url,'http://x'); const userId=url.searchParams.get('userId'); if(!userId) return bad(res,400,'Thiếu userId')
 const items=await prisma.transaction.findMany({where:{userId},orderBy:{createdAt:'desc'},take:100}); return ok(res,{items}) } catch(e){ return bad(res,400,e.message||'Bad request') } }