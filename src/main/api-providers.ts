import type {Metric,ProviderSnapshot} from '../shared/model';
import type {ApiProvider} from '../shared/connectors';
import {readJson} from './read-json';
// Only documented, read-only endpoints; never follow redirects carrying a key.
const urls:Record<ApiProvider,string>={openrouter:'https://openrouter.ai/api/v1/key',deepseek:'https://api.deepseek.com/user/balance',poe:'https://api.poe.com/usage/current_balance',openai:'https://api.openai.com/v1/organization/costs',anthropic:'https://api.anthropic.com/v1/organizations/cost_report',fal:'https://api.fal.ai/v1/account/billing',together:'https://api.together.ai/v1/billing/usage'};
function number(value:unknown){return typeof value==='number'&&Number.isFinite(value)&&value>=0?value:undefined}
export function apiMetrics(id:ApiProvider,data:any,now=Date.now()):Metric[]{
 const base={source:'provider' as const,observedAt:now};
 if(id==='fal'){const balance=number(data?.credits?.current_balance),currency=data?.credits?.currency;return balance===undefined||typeof currency!=='string'||!/^[A-Z]{3}$/.test(currency)?[]:[{...base,id:'fal:balance',label:'apiBalance',remaining:balance,unit:'currency',currency}]}
 if(id==='together'){
  if(!Array.isArray(data?.data)||data.currency!=='USD'||data.next_cursor)return [];
  let total=0;for(const window of data.data){if(!Array.isArray(window?.line_items))return [];for(const item of window.line_items){const cost=typeof item?.cost==='string'&&item.cost.trim()?number(Number(item.cost)):undefined;if(cost===undefined)return [];total+=cost}}
  return Number.isFinite(total)?[{...base,id:'together:monthly',label:'monthlyApiSpend',used:total,unit:'currency',currency:'USD'}]:[];
 }
 if(id==='openai'||id==='anthropic'){
  if(!Array.isArray(data?.data)||data.has_more===true)return [];
  let total=0;for(const bucket of data.data){if(!Array.isArray(bucket?.results))return [];for(const r of bucket.results){const amount=id==='openai'?number(r?.amount?.value):typeof r?.amount==='string'&&r.amount.trim()?number(Number(r.amount)/100):undefined;const currency=id==='openai'?r?.amount?.currency:r?.currency;if(amount===undefined||typeof currency!=='string'||currency.toUpperCase()!=='USD')return [];total+=amount}}
  return Number.isFinite(total)?[{...base,id:id+':monthly',label:'monthlyApiSpend',used:total,unit:'currency',currency:'USD'}]:[];
 }
 if(id==='poe'){const n=number(data?.current_point_balance);return n===undefined?[]:[{...base,id:'poe:points',label:'pointsRemaining',remaining:n,unit:'points'}]}
 if(id==='deepseek')return Array.isArray(data?.balance_infos)?data.balance_infos.flatMap((b:any)=>{const n=typeof b?.total_balance==='string'&&b.total_balance.trim()?number(Number(b.total_balance)):undefined;return n===undefined||!['USD','CNY'].includes(b.currency)?[]:[{...base,id:'deepseek:'+b.currency,label:'apiBalance',remaining:n,unit:'currency',currency:b.currency}]}):[];
 const d=data?.data;if(!d||typeof d!=='object')return [];
 const result:Metric[]=[];const limit=number(d.limit),remaining=number(d.limit_remaining);
 if(limit!==undefined&&remaining!==undefined&&remaining<=limit)result.push({...base,id:'openrouter:cap',label:'keyBudgetRemaining',remaining,limit,unit:'currency',currency:'USD',...(limit>0?{remainingPercent:remaining/limit*100}:{})});
 const monthly=number(d.usage_monthly);if(monthly!==undefined)result.push({...base,id:'openrouter:spend',label:'monthlyApiSpend',used:monthly,unit:'currency',currency:'USD'});
 return result;
}
export async function collectApiProvider(id:ApiProvider,key:string|undefined,signal:AbortSignal):Promise<ProviderSnapshot>{
 const base:ProviderSnapshot={id,providerId:id,auth:'unknown',metrics:[],state:'unavailable',message:'apiKeyRequired',observedAt:Date.now()};
 if(!key)return base;
 try{
  const url=new URL(urls[id]);const admin=id==='openai'||id==='anthropic';const now=new Date();const start=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),1));
  if(id==='fal')url.searchParams.set('expand','credits');
  if(id==='together'){url.searchParams.set('month',now.toISOString().slice(0,7));url.searchParams.set('granularity','day')}
  if(admin){url.searchParams.set('limit','31');url.searchParams.set(id==='openai'?'start_time':'starting_at',id==='openai'?String(start.getTime()/1000):start.toISOString());url.searchParams.set(id==='openai'?'end_time':'ending_at',id==='openai'?String(Math.floor(now.getTime()/1000)):now.toISOString())}
  const headers:Record<string,string>=id==='anthropic'?{'x-api-key':key,'anthropic-version':'2023-06-01',Accept:'application/json'}:{Authorization:(id==='fal'?'Key ':'Bearer ')+key,Accept:'application/json'};
  const requestSignal=AbortSignal.any([signal,AbortSignal.timeout(10000)]);let data:any;const windows:any[]=[];const cursors=new Set<string>();
  for(let page=0;page<32;page++){
   const response=await fetch(url.href,{method:'GET',headers,redirect:'error',signal:requestSignal});
   if(response.status===401||response.status===403)return {...base,auth:'required',state:'error',message:'apiKeyRejected'};
   if(response.status===429)return {...base,state:'error',message:'apiRateLimited'};
   if(!response.ok)return {...base,state:'error',message:'quotaReadFailed'};
   data=await readJson(response);
   if(id!=='together')break;
   if(!Array.isArray(data.data)||data.currency!=='USD')throw Error('malformed');windows.push(...data.data);
   const cursor=data.next_cursor;if(cursor===null||cursor===undefined||cursor===''){data={...data,data:windows};break}
   if(typeof cursor!=='string'||cursor.length>2000||cursors.has(cursor)||page===31)throw Error('pagination');cursors.add(cursor);url.searchParams.set('after',cursor);
  }
  const metrics=apiMetrics(id,data,base.observedAt);
  return {...base,auth:'connected',metrics,state:metrics.length?'ready':'unavailable',message:metrics.length?id==='together'?'apiCostDelayedInfo':admin?'apiCostInfo':id==='openrouter'?'keyBudgetInfo':'apiBalanceInfo':'quotaUnavailable'};
 }catch{return {...base,state:'error',message:signal.aborted?'cancelled':'quotaReadFailed'}}
}
