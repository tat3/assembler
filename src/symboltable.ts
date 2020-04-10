import { clone } from './util'

export const initialSymbolTable: {[key: string]: number} = {
  'SP': 0,
  'LCL': 1,
  'ARG': 2,
  'THIS': 3,
  'THAT': 4,
  'R0': 0,
  'R1': 1,
  'R2': 2,
  'R3': 3,
  'R4': 4,
  'R5': 5,
  'R6': 6,
  'R7': 7,
  'R8': 8,
  'R9': 9,
  'R10': 10,
  'R11': 11,
  'R12': 12,
  'R13': 13,
  'R14': 14,
  'R15': 15,
  'SCREEN': 16384,
  'KBD': 24576
}

export class SymbolTable {
  symbolTable: {[key: string]: number} = clone(initialSymbolTable)

  addEntry = (symbol: string, address: number) => {
    if (this.contains(symbol)) {
      throw new Error(`symbol "${symbol}" is already contained in address ${this.symbolTable[symbol]}`)
    }
    this.symbolTable[symbol] = address
  }

  contains = (symbol: string) => {
    return symbol in this.symbolTable
  }

  getAddress = (symbol: string) => {
    if (this.contains(symbol)) {
      return this.symbolTable[symbol]
    }
    throw new Error(`symbol "${symbol}" is not contained yet`)
  }
}
