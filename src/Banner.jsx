export default function Banner({ settings }){
  if(!settings?.banner?.enabled) return null
  const {title,subtitle,image,ctaText,ctaLink}=settings.banner; const p=settings.site?.primary||'#d71920', s=settings.site?.secondary||'#ffd700'
  return (<div style={{position:'relative',margin:'16px 0'}}>
    <div style={{position:'relative',zIndex:1,overflow:'hidden',borderRadius:16,border:`1px solid ${p}77`,background:`linear-gradient(135deg, ${p} 0%, #7a0b12 60%)`,padding:20}}>
      <div style={{display:'flex',gap:16,alignItems:'center'}}>
        <div style={{flex:'0 0 120px'}}><img src={image} alt="" style={{width:120,height:80,objectFit:'cover',border:`1px solid ${s}55`,borderRadius:8}}/></div>
        <div style={{flex:1,color:'#fff'}}><h2 style={{margin:0,fontSize:28}}>{title}</h2>{subtitle&&<p style={{margin:'6px 0 14px',opacity:.95}}>{subtitle}</p>}
          {ctaText&&<a href={ctaLink||'#'} style={{display:'inline-block',padding:'10px 16px',background:s,color:'#540000',borderRadius:10,textDecoration:'none',fontWeight:800}}> {ctaText} </a>}
        </div>
      </div>
    </div></div>)
}