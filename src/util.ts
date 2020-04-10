export const range = (a: number) => Array.from({ length: a }, (k, i) => i)

export const clone = <T>(a: T) => JSON.parse(JSON.stringify(a))

export const isNumber = (a: string) => !isNaN(Number(a))
