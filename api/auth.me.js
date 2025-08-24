import prisma from '../_db.js';import {ok,bad} from '../_json.js';import jwt from 'jsonwebtoken';import {JWT_SECRET} from '../_env.js'
export default async (req,res)=>{ try{ const auth=req.headers.authorization||''; const token=auth.replace(/^Bearer\s+/i,''); const p=jwt.verify(token,JWT_SECRET)
 const u=await prisma.user.findUnique({where:{id:p.uid}}); if(!u) return bad(res,404,'User not found')
 return ok(res,{user:{id:u.id,email:u.email,role:u.role,points:u.points}})} catch(e){ return bad(res,401,'Unauthorized') } }