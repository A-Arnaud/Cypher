import {nativeImage,type NativeImage} from 'electron';
import path from 'node:path';
import type {IndicatorItem} from './tray-host';
const assets=path.join(__dirname,'../assets/indicator');
const cache=new Map<string,NativeImage>();
function asset(name:string){let image=cache.get(name);if(!image){image=nativeImage.createFromPath(path.join(assets,name+'.png'));cache.set(name,image)}return image}
export function indicatorRows(item:IndicatorItem){const q=item.quotas;if(q.length===1&&(q[0].label==='weekly'||q[0].label==='7d'))return [undefined,q[0]];return q.length?q:[{label:'quota',text:item.text}];}
/** Compose at 2x using pre-rendered glyph masks. macOS keeps one narrow, variable-width image. */
export function indicatorImage(items:IndicatorItem[],mac:boolean):NativeImage{
 const shown=items.slice(0,3),cell=mac?56:22,width=Math.max(1,shown.length*cell),height=22,scale=2;
 const bitmap=Buffer.alloc(width*height*scale*scale*4);
 function paint(image:NativeImage,left:number,top:number,tint?:[number,number,number]){
  const size=image.getSize(),data=image.toBitmap();
  for(let y=0;y<size.height&&top+y<height*scale;y++)for(let x=0;x<size.width&&left+x<width*scale;x++){
   const a=(y*size.width+x)*4,b=((top+y)*width*scale+left+x)*4,alpha=data[a+3];
   if(!alpha)continue;
   if(tint){bitmap[b]=Math.round(tint[2]*alpha/255);bitmap[b+1]=Math.round(tint[1]*alpha/255);bitmap[b+2]=Math.round(tint[0]*alpha/255);bitmap[b+3]=alpha}else data.copy(bitmap,b,a,a+4);
  }
 }
 shown.forEach((item,index)=>{
  const x=index*cell*scale,rows=indicatorRows(item),ink:[number,number,number]=[245,245,245];
  if(mac){const logo=asset(item.providerId);paint((logo.isEmpty()?asset('service'):logo).resize({width:32,height:32}),x+2,6);}
  for(let row=0;row<2;row++){
   const text=rows[row]?.text??'—',match=/^(100|\d{1,2})%$/.exec(text),n=match?Number(match[1]):101;
   const mask=asset(mac?'percent':'number').crop({x:0,y:n*22,width:mac?60:40,height:22});
   const left=x+(mac?38:2),top=row*22;
   if(!mac){const size=mask.getSize(),data=mask.toBitmap();for(let y=0;y<size.height;y++)for(let px=0;px<size.width;px++)if(data[(y*size.width+px)*4+3]>50)for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]]){const xx=left+px+dx,yy=top+y+dy;if(xx>=0&&xx<width*scale&&yy>=0&&yy<height*scale){const b=(yy*width*scale+xx)*4;bitmap[b]=bitmap[b+1]=bitmap[b+2]=15;bitmap[b+3]=230}}}
   paint(mask,left,top,mac?ink:item.stale?[235,185,100]:n<=5?[255,135,135]:n<=20?[255,210,100]:ink);
  }
  // A visible old-reading mark survives macOS template tinting.
  if(item.stale&&mac)for(let y=32;y<38;y++)for(let x2=29;x2<33;x2++){const b=(y*width*scale+x+x2)*4;bitmap[b]=bitmap[b+1]=bitmap[b+2]=bitmap[b+3]=255}
 });
 const image=nativeImage.createFromBitmap(bitmap,{width:width*scale,height:height*scale,scaleFactor:scale});
 if(mac)image.setTemplateImage(true);return image;
}
