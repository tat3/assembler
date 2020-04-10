export class SymbolTable {
  symbolTable: {[key: string]: number} = {}

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
