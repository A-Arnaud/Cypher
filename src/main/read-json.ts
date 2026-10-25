// Bound bytes while reading, rather than after buffering an entire response.
export async function readJson(response:Response,maxBytes=1_000_000):Promise<any>{
 const length=Number(response.headers.get('content-length'));if(Number.isFinite(length)&&length>maxBytes){await response.body?.cancel();throw Error('response-too-large')}
 if(!response.body)throw Error('missing-response-body');const reader=response.body.getReader();const chunks:Uint8Array[]=[];let size=0;
 try{for(;;){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>maxBytes){await reader.cancel();throw Error('response-too-large')}chunks.push(value)}}finally{reader.releaseLock()}
 const buffer=new Uint8Array(size);let offset=0;for(const chunk of chunks){buffer.set(chunk,offset);offset+=chunk.byteLength}
 return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(buffer));
}
