export const apiProviders=['openrouter','deepseek','poe','openai','anthropic','fal','together'] as const;
export type ApiProvider=typeof apiProviders[number];
export const apiKeyUrls:Record<ApiProvider,string>={openrouter:'https://openrouter.ai/settings/keys',deepseek:'https://platform.deepseek.com/api_keys',poe:'https://poe.com/api/keys',openai:'https://platform.openai.com/settings/organization/admin-keys',anthropic:'https://platform.claude.com/settings/admin-keys',fal:'https://fal.ai/dashboard/keys',together:'https://api.together.ai/settings/api-keys'};
export function isApiProvider(id:unknown):id is ApiProvider{return typeof id==='string'&&apiProviders.includes(id as ApiProvider)}
export const localProviderUrls:Record<string,string>={ollama:'http://127.0.0.1:11434/api/tags',lmstudio:'http://127.0.0.1:1234/v1/models',llamacpp:'http://127.0.0.1:8080/v1/models',vllm:'http://127.0.0.1:8000/v1/models'};
export function isLocalProvider(id:string){return Object.hasOwn(localProviderUrls,id)}
