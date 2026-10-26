export type TaskbarBackend='embedded'|'tray';
/** Only the known Windows 10 shell family may host the legacy ReBar surface. */
export function taskbarBackend(platform:string,release:string):TaskbarBackend {
 const match=/^10\.0\.(\d+)$/.exec(release);
 return platform==='win32'&&match&&Number(match[1])>=10240&&Number(match[1])<22000?'embedded':'tray';
}
