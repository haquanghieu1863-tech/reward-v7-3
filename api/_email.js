import { RESEND_API_KEY, FROM_EMAIL } from './_env.js'
export async function sendResetEmail(to, link){
  if(!RESEND_API_KEY||!FROM_EMAIL){ console.log('[RESET LINK]', to, link); return { delivered:false }; }
  const r=await fetch('https://api.resend.com/emails',{
    method:'POST', headers:{'Authorization':`Bearer ${RESEND_API_KEY}`,'Content-Type':'application/json'},
    body: JSON.stringify({ from: FROM_EMAIL, to, subject: 'Đặt lại mật khẩu', html:`<a href="${link}">${link}</a>` })
  })
  if(!r.ok) throw new Error('Resend error '+await r.text())
  return await r.json()
}
