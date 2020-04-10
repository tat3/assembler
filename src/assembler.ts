import { Parser, A_COMMAND, L_COMMAND, C_COMMAND } from './parser'
import { SymbolTable } from './symboltable'
import { Code } from './code'
import { isNumber } from './util'

export class Assembler {
  constructor(public code: string) {}

  build = () => {
    const parser = new Parser(this.code)
    const table = new SymbolTable()
    this.setLabelSymbol(table)
    const instructions = [] as string[]
    let variableAddress = 16
    while (true) {
      try {
        parser.advance()
      } catch (e) {
        break
      }
      const type = parser.commandType()
      if (type === A_COMMAND) {
        const symbol = parser.symbol()
        if (!isNumber(symbol) && !table.contains(symbol)) {
          table.addEntry(symbol, variableAddress)
          variableAddress++
        }
        instructions.push(this.ACommandInstruction(symbol, table))
      } else if (type === C_COMMAND) {
        instructions.push(this.CCommandInstruction(parser.comp(), parser.dest(), parser.jump()))
      }
    }
    return instructions.join('\n') + '\n'
  }

  setLabelSymbol = (table: SymbolTable) => {
    const parser = new Parser(this.code)
    let currentAddress = 0
    while (true) {
      try {
        parser.advance()
      } catch (e) {
        break
      }
      const type = parser.commandType()
      if (type === A_COMMAND || type === C_COMMAND) {
        currentAddress++
      } else if (type === L_COMMAND) {
        table.addEntry(parser.symbol(), currentAddress)
      }
    }
  }

  ACommandInstruction = (symbol: string, table: SymbolTable) => {
    const address = isNumber(symbol) ? symbol : String(table.getAddress(symbol))
    const s = this.decimal2bin(address)
    if (s.length > 15) {
      throw new Error('symbol address is too large')
    }
    return '0'.repeat(16 - s.length) + s
  }

  CCommandInstruction = (comp: string, dest: string | null, jump: string | null) => {
    const c = new Code()
    const compCode = c.compCode(comp)
    const destCode = c.destCode(dest || 'null')
    const jumpCode = c.jumpCode(jump || 'null')
    return `111${compCode}${destCode}${jumpCode}`
  }

  decimal2bin = (d: string) => parseInt(d).toString(2)
}
