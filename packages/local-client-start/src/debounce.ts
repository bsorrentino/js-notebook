
export function makeDebounce(debounceTime:number) {
    let saveTimer:any
 
    return ( task: () => void) => {
     if (saveTimer) 
       clearTimeout(saveTimer);
   
     saveTimer = setTimeout(task, debounceTime);
   }
 }
 