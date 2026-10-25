import type {Language,Metric} from './model';
import {copy} from './i18n';
export function metricValue(metric:Metric,language:Language):string{
 const value=metric.remaining??metric.used;if(value===undefined||!Number.isFinite(value))return '—';
 if(metric.unit==='currency'&&metric.currency&&/^[A-Z]{3}$/.test(metric.currency))return new Intl.NumberFormat(language,{style:'currency',currency:metric.currency,maximumFractionDigits:2}).format(value);
 return new Intl.NumberFormat(language,{maximumFractionDigits:metric.unit==='points'||metric.unit==='models'?0:2}).format(value);
}
export function metricLabel(metric:Metric,language:Language):string{
 const minutes=/^(\d+(?:\.\d+)?)m$/.exec(metric.label);
 if(!minutes)return copy(language,metric.unit==='models'?'models':metric.label);
 const n=Number(minutes[1]);
 if(n>=1440&&n%1440===0)return `${n/1440} ${language==='fr'?'jours':'days'}`;
 if(n>=60&&n%60===0)return `${n/60} h`;
 return `${new Intl.NumberFormat(language).format(n)} min`;
}
