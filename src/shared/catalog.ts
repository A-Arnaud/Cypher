export interface CatalogEntry {id:string;name:string;kind:'subscription'|'api'|'local'|'agent';support:'partial'|'planned';color:string;glyph:string;usageUrl?:string;command?:string;config?:string;billing?:string}
export const catalog:CatalogEntry[]=[
  {
    "id": "codex",
    "name": "Codex",
    "kind": "subscription",
    "support": "partial",
    "color": "#b6ead8",
    "glyph": "C",
    "usageUrl": "https://chatgpt.com/codex/settings/usage",
    "command": "codex",
    "config": ".codex"
  },
  {
    "id": "claude",
    "name": "Claude Code",
    "kind": "subscription",
    "support": "partial",
    "color": "#dcb393",
    "glyph": "✳",
    "usageUrl": "https://claude.ai/settings/usage",
    "command": "claude",
    "config": ".claude"
  },
  {
    "id": "gemini",
    "name": "Gemini CLI",
    "kind": "subscription",
    "support": "partial",
    "color": "#9db8ff",
    "glyph": "✦",
    "usageUrl": "https://aistudio.google.com/usage",
    "command": "gemini",
    "config": ".gemini"
  },
  {
    "id": "opencode",
    "name": "OpenCode",
    "kind": "agent",
    "support": "partial",
    "color": "#b6bce5",
    "glyph": "O",
    "usageUrl": "https://opencode.ai",
    "command": "opencode",
    "config": ".config/opencode",
    "billing": "upstream"
  },
  {
    "id": "aider",
    "name": "Aider",
    "kind": "agent",
    "support": "partial",
    "color": "#a5db8b",
    "glyph": "A",
    "usageUrl": "https://aider.chat",
    "command": "aider",
    "config": ".aider",
    "billing": "upstream"
  },
  {
    "id": "ollama",
    "name": "Ollama",
    "kind": "local",
    "support": "partial",
    "color": "#dae0e6",
    "glyph": "o",
    "usageUrl": "https://ollama.com",
    "command": "ollama",
    "config": ".ollama"
  },
  {
    "id": "lmstudio",
    "name": "LM Studio",
    "kind": "local",
    "support": "partial",
    "color": "#c4acff",
    "glyph": "LM",
    "usageUrl": "https://lmstudio.ai",
    "command": "lms",
    "config": ".lmstudio"
  },
  {
    "id": "cursor",
    "name": "Cursor",
    "kind": "subscription",
    "support": "partial",
    "color": "#c4c9cb",
    "glyph": "↗",
    "usageUrl": "https://cursor.com/dashboard",
    "command": "cursor",
    "config": ".cursor"
  },
  {
    "id": "windsurf",
    "name": "Windsurf",
    "kind": "subscription",
    "support": "partial",
    "color": "#82d9c6",
    "glyph": "≈",
    "usageUrl": "https://windsurf.com/subscription",
    "command": "windsurf",
    "config": ".windsurf"
  },
  {
    "id": "copilot",
    "name": "GitHub Copilot",
    "kind": "subscription",
    "support": "partial",
    "color": "#b4b6f5",
    "glyph": "⌘",
    "usageUrl": "https://github.com/settings/copilot"
  },
  {
    "id": "continue",
    "name": "Continue",
    "kind": "agent",
    "support": "partial",
    "color": "#e1b485",
    "glyph": "∞",
    "usageUrl": "https://hub.continue.dev",
    "config": ".continue",
    "billing": "upstream"
  },
  {
    "id": "chatgpt",
    "name": "ChatGPT",
    "kind": "subscription",
    "support": "planned",
    "color": "#a7adba",
    "glyph": "C",
    "usageUrl": "https://chatgpt.com"
  },
  {
    "id": "perplexity",
    "name": "Perplexity",
    "kind": "subscription",
    "support": "planned",
    "color": "#a7adba",
    "glyph": "P",
    "usageUrl": "https://www.perplexity.ai/settings"
  },
  {
    "id": "poe",
    "name": "Poe",
    "kind": "subscription",
    "support": "partial",
    "color": "#a7adba",
    "glyph": "P",
    "usageUrl": "https://poe.com/settings"
  },
  {
    "id": "lechat",
    "name": "Le Chat",
    "kind": "subscription",
    "support": "planned",
    "color": "#a7adba",
    "glyph": "L",
    "usageUrl": "https://chat.mistral.ai"
  },
  {
    "id": "deepseek-chat",
    "name": "DeepSeek Chat",
    "kind": "subscription",
    "support": "planned",
    "color": "#a7adba",
    "glyph": "D",
    "usageUrl": "https://chat.deepseek.com"
  },
  {
    "id": "grok",
    "name": "Grok",
    "kind": "subscription",
    "support": "planned",
    "color": "#a7adba",
    "glyph": "G",
    "usageUrl": "https://grok.com"
  },
  {
    "id": "openai",
    "name": "OpenAI API",
    "kind": "api",
    "support": "partial",
    "color": "#a7adba",
    "glyph": "O",
    "usageUrl": "https://platform.openai.com/usage"
  },
  {
    "id": "anthropic",
    "name": "Anthropic API",
    "kind": "api",
    "support": "partial",
    "color": "#a7adba",
    "glyph": "A",
    "usageUrl": "https://console.anthropic.com/settings/usage"
  },
  {
    "id": "google-ai",
    "name": "Google AI Studio",
    "kind": "api",
    "support": "planned",
    "color": "#a7adba",
    "glyph": "G",
    "usageUrl": "https://aistudio.google.com/usage"
  },
  {
    "id": "openrouter",
    "name": "OpenRouter",
    "kind": "api",
    "support": "partial",
    "color": "#a7adba",
    "glyph": "O",
    "usageUrl": "https://openrouter.ai/activity"
  },
  {
    "id": "mistral",
    "name": "Mistral API",
    "kind": "api",
    "support": "planned",
    "color": "#a7adba",
    "glyph": "M",
    "usageUrl": "https://console.mistral.ai"
  },
  {
    "id": "deepseek",
    "name": "DeepSeek API",
    "kind": "api",
    "support": "partial",
    "color": "#a7adba",
    "glyph": "D",
    "usageUrl": "https://platform.deepseek.com/usage"
  },
  {
    "id": "groq",
    "name": "Groq",
    "kind": "api",
    "support": "planned",
    "color": "#a7adba",
    "glyph": "G",
    "usageUrl": "https://console.groq.com"
  },
  {
    "id": "together",
    "name": "Together AI",
    "kind": "api",
    "support": "partial",
    "color": "#a7adba",
    "glyph": "T",
    "usageUrl": "https://api.together.ai"
  },
  {
    "id": "fireworks",
    "name": "Fireworks AI",
    "kind": "api",
    "support": "planned",
    "color": "#a7adba",
    "glyph": "F",
    "usageUrl": "https://fireworks.ai/account"
  },
  {
    "id": "xai",
    "name": "xAI API",
    "kind": "api",
    "support": "planned",
    "color": "#a7adba",
    "glyph": "x",
    "usageUrl": "https://console.x.ai"
  },
  {
    "id": "cohere",
    "name": "Cohere",
    "kind": "api",
    "support": "planned",
    "color": "#a7adba",
    "glyph": "C",
    "usageUrl": "https://dashboard.cohere.com"
  },
  {
    "id": "huggingface",
    "name": "Hugging Face",
    "kind": "api",
    "support": "planned",
    "color": "#a7adba",
    "glyph": "H",
    "usageUrl": "https://huggingface.co/settings/billing"
  },
  {
    "id": "replicate",
    "name": "Replicate",
    "kind": "api",
    "support": "planned",
    "color": "#a7adba",
    "glyph": "R",
    "usageUrl": "https://replicate.com/account/billing"
  },
  {
    "id": "fal",
    "name": "fal.ai",
    "kind": "api",
    "support": "partial",
    "color": "#a7adba",
    "glyph": "f",
    "usageUrl": "https://fal.ai/dashboard"
  },
  {
    "id": "azure",
    "name": "Azure OpenAI",
    "kind": "api",
    "support": "planned",
    "color": "#a7adba",
    "glyph": "A",
    "usageUrl": "https://portal.azure.com"
  },
  {
    "id": "bedrock",
    "name": "AWS Bedrock",
    "kind": "api",
    "support": "planned",
    "color": "#a7adba",
    "glyph": "A",
    "usageUrl": "https://console.aws.amazon.com/bedrock"
  },
  {
    "id": "vertex",
    "name": "Vertex AI",
    "kind": "api",
    "support": "planned",
    "color": "#a7adba",
    "glyph": "V",
    "usageUrl": "https://console.cloud.google.com/vertex-ai"
  },
  {
    "id": "llamacpp",
    "name": "llama.cpp",
    "kind": "local",
    "support": "partial",
    "color": "#a7adba",
    "glyph": "l",
    "usageUrl": "https://github.com/ggml-org/llama.cpp"
  },
  {
    "id": "vllm",
    "name": "vLLM",
    "kind": "local",
    "support": "partial",
    "color": "#a7adba",
    "glyph": "v",
    "usageUrl": "https://docs.vllm.ai"
  }
];
