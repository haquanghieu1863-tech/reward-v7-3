export const ok=(res,data={})=>{res.setHeader('Content-Type','application/json');res.statusCode=200;res.end(JSON.stringify({ok:true,...data}))}
export const bad=(res,code,msg)=>{res.setHeader('Content-Type','application/json');res.statusCode=code;res.end(JSON.stringify({ok:false,message:msg}))}
