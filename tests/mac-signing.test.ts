import {it,expect} from 'vitest';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {requireSigningEnvironment,signedMacConfig,requireDeveloperIdSignature}=require('../scripts/mac-signing.cjs');
const env={CSC_LINK:'fixture-certificate',CSC_KEY_PASSWORD:'fixture-password',APPLE_ID:'fixture@example.invalid',APPLE_APP_SPECIFIC_PASSWORD:'fixture-app-password',APPLE_TEAM_ID:'FIXTURE123'};
it('rejects missing notarization credentials without printing secret values',()=>{
 expect(()=>requireSigningEnvironment(env)).not.toThrow();
 expect(()=>requireSigningEnvironment({...env,APPLE_TEAM_ID:''})).toThrow('APPLE_TEAM_ID');
 try{requireSigningEnvironment({...env,APPLE_ID:''})}catch(error){expect(String(error)).not.toContain('fixture-app-password')}
 expect(()=>requireSigningEnvironment({...env,GITHUB_EVENT_NAME:'pull_request'})).toThrow('pull requests');
});
it('removes ad-hoc signing and requires notarization without changing preview or Windows configuration',()=>{
 const base=require('../package.json').build;const before=JSON.stringify(base);const config=signedMacConfig(base);
 expect(config.forceCodeSigning).toBe(true);expect(config.mac.identity).toBeUndefined();expect(config.mac.hardenedRuntime).toBe(true);expect(config.mac.notarize).toBe(true);expect(config.dmg.sign).toBe(true);
 expect(config.win).toEqual(base.win);expect(JSON.stringify(base)).toBe(before);
});
it('rejects ad-hoc, wrong publisher certificate types and non-hardened signatures',()=>{
 expect(()=>requireDeveloperIdSignature('Signature=adhoc\nflags=0x10000(runtime)')).toThrow('Developer ID');
 expect(()=>requireDeveloperIdSignature('Authority=Apple Development: Fixture\nflags=0x10000(runtime)')).toThrow('Developer ID');
 expect(()=>requireDeveloperIdSignature('Authority=Developer ID Application: Fixture\nflags=0x0(none)')).toThrow('hardened runtime');
 expect(()=>requireDeveloperIdSignature('CodeDirectory v=20500 size=450 flags=0x10000(runtime) hashes=12+7\nAuthority=Developer ID Application: Fixture')).not.toThrow();
});
