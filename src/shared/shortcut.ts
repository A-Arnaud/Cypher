export function validShortcut(value:unknown):value is string{
 if(typeof value!=='string'||! /^(Control|Ctrl|Alt|Shift|Super)(\+(Control|Ctrl|Alt|Shift|Super)){0,3}\+[A-Z0-9]$/.test(value))return false;
 const modifiers=value.split('+').slice(0,-1).map(k=>k==='Ctrl'?'Control':k);
 return new Set(modifiers).size===modifiers.length;
}
