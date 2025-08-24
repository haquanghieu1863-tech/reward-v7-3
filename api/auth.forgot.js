import prisma from '../_db.js';import {ok,bad} from '../_json.js';import crypto from 'crypto';import {APP_URL} from '../_env.js';import {sendResetEmail} from '../_email.js'
export default async (req,res)=>{ if(req.method!=='POST')return bad(res,405,'Method not allowed')
 const {email}=JSON.parse(req.body||'{}'); if(!email) return bad(res,400,'Thiếu email')
 const user=await prisma.user.findUnique({where:{email}}); if(!user) return ok(res,{message:'Nếu email tồn tại, link reset đã gửi'})
 const token=crypto.randomBytes(24).toString('hex'); const expiresAt=new Date(Date.now()+1000*60*30)
 await prisma.resetToken.create({data:{token,userId:user.id,expiresAt}}); const link=`${APP_URL}/#reset?token=${token}`; await sendResetEmail(email,link); return ok(res,{message:'Đã gửi link',link}) }