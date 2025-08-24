import prisma from '../_db.js';import {ok,bad} from '../_json.js';import bcrypt from 'bcryptjs'
export default async (req,res)=>{ if(req.method!=='POST')return bad(res,405,'Method not allowed')
 try{ const {email,password}=JSON.parse(req.body||'{}'); if(!email||!password) return bad(res,400,'Thiếu email/password')
  const exist=await prisma.user.findUnique({where:{email}}); if(exist) return bad(res,409,'Email đã tồn tại')
  const hash=await bcrypt.hash(password,10); const adminExists=await prisma.user.findFirst({where:{role:'admin'}})
  const role=adminExists?'user':'admin'; const user=await prisma.user.create({data:{email,password:hash,role}})
  return ok(res,{user:{id:user.id,email:user.email,role:user.role}}) } catch(e){ return bad(res,500,e.message) } }