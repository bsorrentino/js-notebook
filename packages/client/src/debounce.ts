
export function makeDebounce(debounceTime: number) {
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
export function makeDebounceWithResult<T = void>(debounceTime: number): ( task: () => T ) => Promise<T> {
  let saveTimer: any

  return (task: () => T) => (
    new Promise((resolve, reject) => {
      if (saveTimer) clearTimeout(saveTimer)

      saveTimer = setTimeout(async () => {
        try {
          const result = await task()
          resolve(result)
        }
        catch (e) {
          reject(e)
        }

      }, debounceTime)
    }
    ))
}
