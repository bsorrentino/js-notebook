/**
 * 
 * @param debounceTime 
 * @returns 
 */
export function makeDebounce(debounceTime: number): ( task: () => void ) => void {
  let saveTimer: any

  return (task: () => void) => {
    if (saveTimer)
      clearTimeout(saveTimer);

    saveTimer = setTimeout(task, debounceTime);
  }
}

/**
 * 
 * @param debounceTime 
 * @returns 
 */
export function makeDebounceAsync<T = void>(debounceTime: number): ( task: () => Promise<T> ) => Promise<T> {
  let saveTimer: any

  return (task: () => Promise<T>) => (
    new Promise((resolve, reject) => {
      if (saveTimer) clearTimeout(saveTimer)

      saveTimer = 
        setTimeout(() => task().then( resolve ).catch( reject ), debounceTime)
    }))
}
