import type {Language} from './model';
export function resetCountdown(value:number,now:number,language:Language):string{
 const minutes=Math.max(1,Math.ceil((value-now)/60000));
 if(value<=now)return language==='fr'?'Remise à zéro en cours':'Reset pending';
 const days=Math.floor(minutes/1440),hours=Math.floor(minutes%1440/60),mins=minutes%60;
 return days?`${days}${language==='fr'?' j':'d'}${hours?` ${hours}h`:''}`:hours?`${hours}h${mins?` ${mins}min`:''}`:`${minutes} min`;
}
