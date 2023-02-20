
/**
 * Convenient function to get route.params.XXX
 * @param obj 
 * @returns 
 */
export function strOrArr(obj: string | string[] | null | undefined): string | null {
  if(obj === null || obj === undefined) return null
  return (typeof obj === 'string') ? obj : obj[0]
}

export function compNullable(a: any | null | undefined, b: any | null | undefined): number | null {
  return (a && b) ? null : ((a) ? 1 : ((b) ? -1 : 0))
}

export function compStr(a: string | null | undefined, b: string | null | undefined): number | null {
  return compNullable(a, b) ?? (a == b ? null : (a! > b! ? 1 : -1))
}

export function compNumber(a: number | null | undefined, b: number | null | undefined): number | null {
  return compNullable(a, b) ?? (a == b ? null : (a! > b! ? 1 : -1))
}
