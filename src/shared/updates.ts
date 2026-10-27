export type UpdatePhase='idle'|'checking'|'current'|'available'|'downloading'|'installing'|'manual'|'error';
export type UpdateMode='automatic'|'manual';
export interface AppUpdateState {active:boolean;automaticChecks:boolean;phase:UpdatePhase;notice:boolean;version?:string;mode?:UpdateMode;reason?:'mac-signing'|'portable'|'metadata'|'installation';progress?:number;lastChecked?:number;error?:'check'|'download'|'install'}
