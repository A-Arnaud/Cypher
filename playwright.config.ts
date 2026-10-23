import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'tests',testMatch:'ui.spec.ts',workers:1,use:{browserName:'chromium',channel:'msedge',viewport:{width:430,height:704}},webServer:{command:'npm run preview -- --port 5173',url:'http://127.0.0.1:5173',reuseExistingServer:true}});
