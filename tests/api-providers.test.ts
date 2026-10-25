import {it,expect,vi} from 'vitest';
import {apiMetrics,collectApiProvider} from '../src/main/api-providers';
import {collectProvider} from '../src/main/providers';
it('keeps key spending caps separate from account balance and respects uncapped keys',()=>{
 const m=apiMetrics('openrouter',{data:{limit:100,limit_remaining:74.5,usage:99,usage_monthly:25.5}});
 expect(m[0]).toMatchObject({label:'keyBudgetRemaining',remaining:74.5,remainingPercent:74.5,currency:'USD'});
 expect(m[1]).toMatchObject({label:'monthlyApiSpend',used:25.5});
 expect(apiMetrics('openrouter',{data:{limit:null,limit_remaining:null,usage_monthly:0}})).toMatchObject([{used:0}]);
});
it('converts Anthropic cents, preserves OpenAI dollars, and rejects partial cost reports',()=>{
 expect(apiMetrics('openai',{data:[{results:[{amount:{currency:'usd',value:1.23}}]}],has_more:false})[0].used).toBe(1.23);
 expect(apiMetrics('anthropic',{data:[{results:[{currency:'USD',amount:'123.45'}]}],has_more:false})[0].used).toBe(1.2345);
 expect(apiMetrics('openai',{data:[],has_more:false})[0].used).toBe(0);
 expect(apiMetrics('openai',{data:[{results:[]}],has_more:true})).toEqual([]);
});
it('preserves provider currencies and points without invented percentages',()=>{
 expect(apiMetrics('deepseek',{balance_infos:[{currency:'CNY',total_balance:'0.00'},{currency:'USD',total_balance:'3.75'}]})).toMatchObject([{currency:'CNY',remaining:0},{currency:'USD',remaining:3.75}]);
 expect(apiMetrics('poe',{current_point_balance:1500})).toMatchObject([{unit:'points',remaining:1500}]);
 expect(apiMetrics('deepseek',{balance_infos:[{currency:'USD',total_balance:''},{currency:'EUR',total_balance:'10'}]})).toEqual([]);
 expect(apiMetrics('poe',{current_point_balance:'1500'})).toEqual([]);
 expect(apiMetrics('openrouter',{data:{limit:10,limit_remaining:Infinity}})).toEqual([]);
});
it('reads fal billing with its documented permission scheme and sums every Together page',async()=>{
 const responses=[{credits:{current_balance:24.5,currency:'USD'}},{currency:'USD',data:[{line_items:[{cost:'1.25'}]}],next_cursor:'page-two'},{currency:'USD',data:[{line_items:[{cost:'2.50'}]}],next_cursor:null}];
 const request=vi.fn().mockImplementation(async()=>new Response(JSON.stringify(responses.shift()),{status:200}));vi.stubGlobal('fetch',request);
 try{expect((await collectApiProvider('fal','synthetic-fal-key',new AbortController().signal)).metrics[0]).toMatchObject({remaining:24.5,currency:'USD'});expect(request).toHaveBeenCalledWith('https://api.fal.ai/v1/account/billing?expand=credits',expect.objectContaining({headers:expect.objectContaining({Authorization:'Key synthetic-fal-key'})}));expect((await collectApiProvider('together','synthetic-together-key',new AbortController().signal)).metrics[0].used).toBe(3.75);expect(request.mock.calls[2][0]).toContain('after=page-two')}finally{vi.unstubAllGlobals()}
});
it('uses only the documented read endpoint and never returns the key',async()=>{
 const request=vi.fn().mockResolvedValue(new Response(JSON.stringify({current_point_balance:1500}),{status:200}));vi.stubGlobal('fetch',request);
 try{const s=await collectApiProvider('poe','synthetic-secret',new AbortController().signal);expect(s.state).toBe('ready');expect(request).toHaveBeenCalledWith('https://api.poe.com/usage/current_balance',expect.objectContaining({method:'GET',redirect:'error',headers:expect.objectContaining({Authorization:'Bearer synthetic-secret'})}));expect(JSON.stringify(s)).not.toContain('synthetic-secret')}finally{vi.unstubAllGlobals()}
});
it('does not access credentials without consent and sanitizes authentication failures',async()=>{
 const key=vi.fn();const request=vi.fn().mockResolvedValue({ok:false,status:401});vi.stubGlobal('fetch',request);
 try{const s=await collectProvider('openrouter',{detections:[],consents:[],apiKey:key},new AbortController().signal);expect(s.state).toBe('consent');expect(key).not.toHaveBeenCalled();expect(request).not.toHaveBeenCalled();expect(await collectApiProvider('openrouter','fixture',new AbortController().signal)).toMatchObject({auth:'required',message:'apiKeyRejected',metrics:[]})}finally{vi.unstubAllGlobals()}
});
