import {it,expect} from 'vitest';import {pinConnectedProfile} from '../src/shared/widget';import {defaultSettings} from '../src/shared/defaults';import type {PublicProfile} from '../src/shared/model';
const profile:PublicProfile={id:'codex-profile-0123456789abcdef',providerId:'codex',connectionMethod:'browser',label:'Cypher fixture',source:'manual',configPresent:true,authFilePresent:true};
it('puts a first browser account in the original visible Codex slot instead of behind empty defaults',()=>{
 const settings=defaultSettings();expect(pinConnectedProfile(settings,[profile],profile.id)).toEqual([profile.id,'claude','gemini']);expect(settings.pinned).toEqual(['codex','claude','gemini']);
});
it('preserves existing or explicitly authorized accounts and normal API pinning',()=>{
 const settings=defaultSettings();const existing:PublicProfile={...profile,id:'codex',connectionMethod:undefined,source:'default'};
 expect(pinConnectedProfile(settings,[existing,profile],profile.id)).toEqual(['codex','claude','gemini',profile.id]);
 expect(pinConnectedProfile({...settings,consents:['codex']},[profile],profile.id)).toEqual(['codex','claude','gemini',profile.id]);
 expect(pinConnectedProfile(settings,[profile],'openrouter')).toEqual(['codex','claude','gemini','openrouter']);
});
