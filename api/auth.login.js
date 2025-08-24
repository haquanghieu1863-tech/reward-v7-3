import prisma from '../_db.js';import {ok,bad} from '../_json.js';import bcrypt from 'bcryptjs';import jwt from 'jsonwebtoken';import {JWT_SECRET} from '../_env.js'
export default async (req,res)=>{ if(req.method!=='POST')return bad(res,405,'Method not allowed')
 try{ const {email,password}=JSON.parse(req.body||'{}'); const user=await prisma.user.findUnique({where:{email}})
  if(!user) return bad(res,401,'Sai thông tin đăng nhập'); const okpw=await bcrypt.compare(password,user.password)
  if(!okpw) return bad(res,401,'Sai thông tin đăng nhập'); const token=jwt.sign({uid:user.id,role:user.role},JWT_SECRET,{expiresIn:'7d'})
  return ok(res,{token,user:{id:user.id,email:user.email,role:user.role,points:user.points}}) } catch(e){ return bad(res,500,e.message) } }