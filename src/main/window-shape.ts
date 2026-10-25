interface Rect {x:number;y:number;width:number;height:number}
// Match the CSS outline in native window coordinates, including hit testing.
export function roundedWindowShape(width:number,height:number,radius:number):Rect[]{
 const r=Math.max(0,Math.min(Math.floor(radius),Math.floor(width/2),Math.floor(height/2)));
 if(r===0)return [{x:0,y:0,width,height}];
 const rects:Rect[]=[];
 for(let y=0;y<r;y++){
  const inset=Math.ceil(r-Math.sqrt(r*r-(r-y-.5)**2));
  rects.push({x:inset,y,width:width-2*inset,height:1},{x:inset,y:height-y-1,width:width-2*inset,height:1});
 }
 if(height>2*r)rects.push({x:0,y:r,width,height:height-2*r});
 return rects;
}
