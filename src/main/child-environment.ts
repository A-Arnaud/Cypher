// Do not forward the parent application's API keys, tokens or Node injection flags.
const allowed=new Set(['systemroot','windir','systemdrive','comspec','path','pathext','userprofile','home','homedrive','homepath','appdata','localappdata','temp','tmp','programfiles','programfiles(x86)','programdata','username','userdomain','lang','lc_all','term','colorterm','no_color','force_color','https_proxy','http_proxy','all_proxy','no_proxy','node_extra_ca_certs','ssl_cert_file','ssl_cert_dir','codex_managed_package_root','codex_managed_by_npm']);
export function childEnvironment(base:NodeJS.ProcessEnv):NodeJS.ProcessEnv{
 return Object.fromEntries(Object.entries(base).filter(([key,value])=>value!==undefined&&allowed.has(key.toLowerCase())));
}
