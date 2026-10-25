import {defineConfig} from '@playwright/test';
import {createServer} from 'node:net';
// Let Windows choose a usable port, including on hosts with reserved ranges.
const port=process.env.CYPHER_UI_PORT?Number(process.env.CYPHER_UI_PORT):await new Promise<number>((resolve,reject)=>{
 const server=createServer();server.once('error',reject);server.listen(0,'127.0.0.1',()=>{
  const address=server.address();const selected=typeof address==='object'&&address?address.port:0;
  server.close(error=>error?reject(error):resolve(selected));
 });
});
if(!Number.isInteger(port)||port<1||port>65535)throw Error('CYPHER_UI_PORT must be a valid TCP port');
// Workers reload this module and must inherit the coordinator's selected port.
process.env.CYPHER_UI_PORT=String(port);
const url='http://127.0.0.1:'+port;
export default defineConfig({testDir:'tests',testMatch:'*ui.spec.ts',workers:1,use:{baseURL:url,browserName:'chromium',channel:'msedge',viewport:{width:430,height:704}},webServer:{command:'npm run preview -- --strictPort --port '+port,url,reuseExistingServer:!process.env.CI}});
