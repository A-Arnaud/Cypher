import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({plugins:[react(),{name:'production-csp',transformIndexHtml:{order:'post',handler(html,ctx){return ctx.server?html:html.replace("connect-src 'self' ws://127.0.0.1:*", "connect-src 'none'")}}}],base:'./',build:{outDir:'dist/renderer'},server:{host:'127.0.0.1'}});
