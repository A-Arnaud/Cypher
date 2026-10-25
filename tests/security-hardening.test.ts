import {it,expect} from 'vitest';
import {childEnvironment} from '../src/main/child-environment';
import {scopedEnvironment} from '../src/main/cli';
import {allowedRendererRequest} from '../src/main/security';
import {readJson} from '../src/main/read-json';
it('does not give one CLI the parent application secrets or Node injection flags',()=>{
 const env={PATH:'C:/Windows',USERPROFILE:'C:/Users/test',OPENAI_API_KEY:'synthetic-secret',GITHUB_TOKEN:'synthetic-github',AWS_SECRET_ACCESS_KEY:'synthetic-aws',NODE_OPTIONS:'--require injected',ELECTRON_RUN_AS_NODE:'1',CLAUDE_CONFIG_DIR:'C:/other',CODEX_HOME:'C:/wrong'};
 expect(childEnvironment(env)).toEqual({PATH:'C:/Windows',USERPROFILE:'C:/Users/test'});
 expect(scopedEnvironment('codex',env,{CODEX_HOME:'C:/selected'})).toEqual({PATH:'C:/Windows',USERPROFILE:'C:/Users/test',CODEX_HOME:'C:/selected'});
});
it('blocks renderer network requests and local files outside the packaged UI',()=>{
 const root='C:/app/dist/renderer/index.html';for(const url of ['https://example.com/leak','http://127.0.0.1:1234/','ws://127.0.0.1:5173','file:///C:/Users/test/auth.json','file:///C:/app/dist/main/index.cjs'])expect(allowedRendererRequest(url,root)).toBe(false);
 expect(allowedRendererRequest('file:///C:/app/dist/renderer/assets/icon.svg',root)).toBe(true);
 expect(allowedRendererRequest('ws://127.0.0.1:5173/',root,'http://127.0.0.1:5173')).toBe(true);
 expect(allowedRendererRequest('ws://127.0.0.1:1234/',root,'http://127.0.0.1:5173')).toBe(false);
});
it('cancels oversized chunked responses before buffering the rest',async()=>{
 let cancelled=false;const response=new Response(new ReadableStream({start(controller){controller.enqueue(new Uint8Array(32))},cancel(){cancelled=true}}));await expect(readJson(response,16)).rejects.toThrow('response-too-large');expect(cancelled).toBe(true);
 await expect(readJson(new Response('{}',{headers:{'Content-Length':'1000000000'}}),16)).rejects.toThrow('response-too-large');
 expect(await readJson(new Response('{"ok":true}'))).toEqual({ok:true});
});
