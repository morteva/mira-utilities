const fs=require('fs'),path=require('path');
const sharp=require(process.env.MIRA_SHARP_PATH || 'sharp');
const dir=__dirname;
const arrow=fs.readFileSync(path.join(dir,'arrow.svg'),'utf8');
const defs='<defs><linearGradient id="p" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fffefb"/><stop offset=".4" stop-color="#f7f3fa"/><stop offset=".75" stop-color="#e7e4ef"/><stop offset="1" stop-color="#d4d4e2"/></linearGradient></defs>';
const stroke='fill="none" stroke="url(#p)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';
const line=d=>`<path d="${d}" ${stroke}/>`;
const double=(a,b)=>line(`M${a} L${b}`);
const arrowBody='<g transform="translate(6 5) scale(.2)">'+arrow.replace(/<svg[^>]*>/g,'').replace('</svg>','')+'</g><circle cx="20.5" cy="6.5" r="1.5" fill="url(#p)"/>';
const specs={
 Arrow:[arrowBody,8,6],
 Pin:['<path d="M16 27 C12 22 7 17 7 12 A9 9 0 0 1 25 12 C25 17 20 22 16 27 Z" fill="url(#p)"/><circle cx="16" cy="12" r="3" fill="#fffefb"/>',16,27],
 Person:['<circle cx="16" cy="9" r="4" fill="url(#p)"/><path d="M8 25 V22 Q8 15 16 15 Q24 15 24 22 V25 Z" fill="url(#p)"/>',16,9],
 Help:['<g transform="translate(3 2) scale(.2)">'+arrow.replace(/<svg[^>]*>|<\/svg>/g,'')+'</g><text x="23" y="19" font-family="Arial" font-weight="bold" font-size="15" fill="url(#p)">?</text>',5,3],
 AppStarting:['<g transform="translate(3 2) scale(.2)">'+arrow.replace(/<svg[^>]*>|<\/svg>/g,'')+'</g><circle cx="24" cy="23" r="5" '+stroke+'/><circle cx="24" cy="23" r="2" fill="#fffefb"/>',5,3],
 Crosshair:[line('M16 6 V13 M16 19 V26 M6 16 H13 M19 16 H26')+'<circle cx="16" cy="16" r="1.5" fill="#fffefb"/>',16,16],
 IBeam:[line('M16 6 V26 M12 6 H20 M12 26 H20'),16,16],
 NWPen:['<path d="M8 25 L10 18 L22 6 Q24 4 26 6 Q28 8 26 10 L14 22 Z" fill="url(#p)"/><path d="M12 18 L23 7" stroke="#fffefb" stroke-width="1.5" stroke-linecap="round"/>',8,25],
 No:['<circle cx="16" cy="16" r="9" '+stroke+'/>'+line('M10 10 L22 22'),16,16],
 SizeNS:[line('M16 6 V26 M11 11 L16 6 L21 11 M11 21 L16 26 L21 21'),16,16],
 SizeWE:[line('M6 16 H26 M11 11 L6 16 L11 21 M21 11 L26 16 L21 21'),16,16],
 SizeNWSE:[line('M8 8 L24 24 M8 15 V8 H15 M17 24 H24 V17'),16,16],
 SizeNESW:[line('M8 24 L24 8 M8 17 V24 H15 M17 8 H24 V15'),16,16],
 SizeAll:[line('M16 5 V27 M5 16 H27 M12 9 L16 5 L20 9 M12 23 L16 27 L20 23 M9 12 L5 16 L9 20 M23 12 L27 16 L23 20'),16,16],
 UpArrow:['<path d="M16 5 Q17 5 18 7 L25 15 Q27 18 23 18 H20 V25 Q20 28 16 28 Q12 28 12 25 V18 H9 Q5 18 7 15 L14 7 Q15 5 16 5 Z" fill="url(#p)"/>',16,5],
 Hand:['<path d="M12 16 V7 Q12 3 15 3 Q18 3 18 7 V13 Q21 10 23 14 Q26 12 27 17 V22 Q27 29 20 29 H16 Q13 29 11 26 L6 19 Q4 16 7 15 Q9 14 12 18 Z" fill="url(#p)"/><path d="M15 7 V17 M16 25 H21" stroke="#fffefb" stroke-opacity=".65" stroke-width="1.5" stroke-linecap="round"/>',15,3]
};
async function render(name,body,hx,hy){
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 32 32">${defs}${body}</svg>`;
 const base=await sharp(Buffer.from(svg)).png().toBuffer();
 const mask=await sharp(base).extractChannel(3).toBuffer();
 async function glow(color,sigma,alpha){return sharp({create:{width:128,height:128,channels:3,background:color}}).joinChannel(await sharp(mask).blur(sigma).linear(alpha,0).toBuffer()).png().toBuffer();}
 const combined=await sharp(await glow('#dce8ff',18,.4)).composite([{input:await glow('#f1eaff',6,.6)},{input:base}]).png().toBuffer();
 const png=await sharp(combined).resize(32,32).png().toBuffer();fs.writeFileSync(path.join(dir,name+'.png'),png);
 const data=await sharp(png).raw().toBuffer(),h=Buffer.alloc(22),d=Buffer.alloc(4264);h.writeUInt16LE(2,2);h.writeUInt16LE(1,4);h[6]=32;h[7]=32;h.writeUInt16LE(hx,10);h.writeUInt16LE(hy,12);h.writeUInt32LE(d.length,14);h.writeUInt32LE(22,18);d.writeUInt32LE(40,0);d.writeInt32LE(32,4);d.writeInt32LE(64,8);d.writeUInt16LE(1,12);d.writeUInt16LE(32,14);d.writeUInt32LE(4096,20);
 for(let y=0;y<32;y++)for(let x=0;x<32;x++){let s=(y*32+x)*4,t=40+((31-y)*32+x)*4;d[t]=data[s+2];d[t+1]=data[s+1];d[t+2]=data[s];d[t+3]=data[s+3];if(!data[s+3])d[4136+(31-y)*4+(x>>3)]|=128>>(x%8);}
 fs.writeFileSync(path.join(dir,name+'.cur'),Buffer.concat([h,d]));
}

function chunk(id,data){const h=Buffer.alloc(8);h.write(id);h.writeUInt32LE(data.length,4);return Buffer.concat([h,data,...(data.length%2?[Buffer.alloc(1)]:[])]);}
(async()=>{
 for(const [name,[body,x,y]] of Object.entries(specs))await render(name,body,x,y);
 const frames=[];
 for(let i=0;i<12;i++){
  const a=i*Math.PI/6,x=16+7*Math.sin(a),y=16-7*Math.cos(a);
  await render('busy-'+i,'<circle cx="16" cy="16" r="7" fill="none" stroke="#ddd8e7" stroke-opacity=".35" stroke-width="2"/><circle cx="'+x+'" cy="'+y+'" r="2.5" fill="url(#p)"/>',16,16);
  frames.push(chunk('icon',fs.readFileSync(path.join(dir,'busy-'+i+'.cur'))));
 }
 const anih=Buffer.alloc(36);[36,12,12,32,32,32,1,5,1].forEach((v,i)=>anih.writeUInt32LE(v,i*4));
 const body=Buffer.concat([Buffer.from('ACON'),chunk('anih',anih),chunk('LIST',Buffer.concat([Buffer.from('fram'),...frames]))]);
 const riff=Buffer.alloc(8);riff.write('RIFF');riff.writeUInt32LE(body.length,4);fs.writeFileSync(path.join(dir,'Wait.ani'),Buffer.concat([riff,body]));
 const names=Object.keys(specs);
 const labels={Arrow:'Normal',Help:'Help',AppStarting:'Background',Crosshair:'Precision',IBeam:'Text',NWPen:'Handwriting',No:'Unavailable',SizeNS:'Vertical',SizeWE:'Horizontal',SizeNWSE:'Diagonal',SizeNESW:'Diagonal',SizeAll:'Move',UpArrow:'Alternate',Hand:'Link',Pin:'Location',Person:'Person'};
 const tiles=await Promise.all(names.map(async(name,i)=>({input:await sharp(path.join(dir,name+'.png')).resize(64,64).png().toBuffer(),left:16+(i%4)*150,top:20+Math.floor(i/4)*110})));
 const texts=names.map((n,i)=>'<text x="'+(48+(i%4)*150)+'" y="'+(100+Math.floor(i/4)*110)+'" text-anchor="middle" fill="#e8e1ef" font-family="Arial" font-size="13">'+labels[n]+'</text>').join('');
 tiles.push({input:Buffer.from('<svg width="600" height="460" xmlns="http://www.w3.org/2000/svg">'+texts+'</svg>'),left:0,top:0});
 await sharp({create:{width:600,height:460,channels:4,background:'#15101e'}}).composite(tiles).png().toFile(path.join(dir,'showcase.png'));
 const preview=names.map(n=>'<figure><img src="data:image/png;base64,'+fs.readFileSync(path.join(dir,n+'.png')).toString('base64')+'" alt="'+labels[n]+' cursor"><figcaption>'+labels[n]+'</figcaption></figure>').join('');
 fs.writeFileSync(path.join(dir,'showcase.html'),'<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mira Cursor Pack showcase</title><style>body{background:#15101e;color:#eee8f4;font:16px Arial;padding:24px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:16px;max-width:700px}figure{margin:0;text-align:center;padding:16px}img{width:64px;height:64px}figcaption{font-size:13px;margin-top:12px}</style><h1>Mira Cursor Pack</h1><p>Pearl white, soft glow, a tiny companion dot. Samples enlarged 2×.</p><main>'+preview+'</main></html>');
 console.log('Built 17 Windows roles, including animated Busy.');
})();