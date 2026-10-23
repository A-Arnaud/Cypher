import {it,expect} from 'vitest';
import {parseCodexLimits,maskAccount} from '../src/main/metrics';
import {collectProvider,dedupeSnapshots} from '../src/main/providers';
it('keeps unknown quota unknown',()=>{expect(parseCodexLimits({rateLimits:{primary:null}})).toEqual([])});
it('normalizes provider percent and reset timestamp without inventing capacity',()=>{
 const m=parseCodexLimits({rateLimits:{primary:{usedPercent:32,windowDurationMins:300,resetsAt:1800000000},secondary:{usedPercent:74,windowDurationMins:10080,resetsAt:null}}},123);
 expect(m[0]).toMatchObject({id:'codex:primary',remainingPercent:68,resetAt:1800000000000,source:'provider',observedAt:123});expect(m[1].remainingPercent).toBe(26);
});
it('rejects malformed percent and duplicate legacy quota buckets',()=>{
 expect(parseCodexLimits({rateLimits:{primary:{usedPercent:'20'}}})).toEqual([]);
 expect(parseCodexLimits({rateLimits:{primary:{usedPercent:10}},rateLimitsByLimitId:{codex:{primary:{usedPercent:10}}}})).toHaveLength(1);
 expect(parseCodexLimits({rateLimits:{primary:{usedPercent:NaN}}})).toHaveLength(0);
});
it('does not show expired provider windows as current quota',()=>{expect(parseCodexLimits({rateLimits:{primary:{usedPercent:32,resetsAt:1}}},2000)).toEqual([])});
it('rejects reset dates outside the JavaScript date range',()=>{expect(parseCodexLimits({rateLimits:{primary:{usedPercent:32,resetsAt:1e20}}})).toEqual([]);expect(parseCodexLimits({rateLimits:{primary:{usedPercent:32,resetsAt:'tomorrow'}}})).toEqual([])});
it('masks account identifiers',()=>{expect(maskAccount('alice@example.com')).toBe('a•••@example.com');expect(maskAccount(null)).toBeUndefined()});
it('requires opt-in before authenticated collection and never infers premium',async()=>{
 const s=await collectProvider('codex',{detections:[{id:'codex',installed:true,configPresent:true,evidence:[],executable:'unused'}],consents:[]},new AbortController().signal);
 expect(s.state).toBe('consent');expect(s.auth).toBe('unknown');expect(s.plan).toBeUndefined();expect(s.metrics).toEqual([]);
});
it('does not inherit the default consent into another discovered profile',async()=>{const s=await collectProvider('codex-profile-0123456789abcdef',{detections:[{id:'codex',installed:true,configPresent:true,evidence:[],executable:'unused'}],consents:['codex'],profiles:[{id:'codex-profile-0123456789abcdef',providerId:'codex',label:'work',root:'C:/work',directory:'C:/work',env:{CODEX_HOME:'C:/work'},source:'auto',configPresent:true,authFilePresent:true}]},new AbortController().signal);expect(s.state).toBe('consent');expect(s.providerId).toBe('codex');expect(s.plan).toBeUndefined()});
it('only marks duplicates for a confirmed server identity, not a masked email',()=>{const base={auth:'connected' as const,metrics:[],state:'ready' as const,message:'providerData',observedAt:1,account:'a•••@example.com'};const rows=dedupeSnapshots([{...base,id:'codex',identityKey:'server-1'},{...base,id:'codex-profile-0000000000000001',identityKey:'server-1'},{...base,id:'codex-profile-0000000000000002'}]);expect(rows[1].duplicateOf).toBe('codex');expect(rows[2].duplicateOf).toBeUndefined()});
it('does not double count agent consumption' ,async()=>{
 const s=await collectProvider('aider',{detections:[],consents:[]},new AbortController().signal);expect(s.metrics).toEqual([]);expect(s.message).toBe('upstream');
});
