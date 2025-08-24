import prisma from '../_db.js';import {ok,bad} from '../_json.js';import bcrypt from 'bcryptjs'
export default async (req,res)=>{ if(req.method!=='POST')return bad(res,405,'Method not allowed')
 const {token,newPassword}=JSON.parse(req.body||'{}'); if(!token||!newPassword) return bad(res,400,'Thiếu token/newPassword')
 const r=await prisma.resetToken.findUnique({where:{token}}); if(!r||r.used) return bad(res,400,'Token không hợp lệ'); if(r.expiresAt<new Date()) return bad(res,400,'Token hết hạn')
 const hash=await bcrypt.hash(newPassword,10); await prisma.user.update({where:{id:r.userId},data:{password:hash}}); await prisma.resetToken.update({where:{token},data:{used:true}})
 return ok(res,{message:'Đặt lại mật khẩu thành công'}) }