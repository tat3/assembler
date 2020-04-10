import { Parser, A_COMMAND, C_COMMAND } from './parser'
import { SymbolTable } from './symboltable'
import { Code } from './code'

export class Assembler {
  constructor(public code: string) {}

  build = () => {
    const parser = new Parser(this.code)
    const instructions = [] as string[]
    while (true) {
      try {
        parser.advance()
      } catch (e) {
        break
      }
      const type = parser.commandType()
      if (type === A_COMMAND) {
        instructions.push(this.ACommandInstruction(parser.symbol()))
      } else if (type === C_COMMAND) {
        instructions.push(this.CCommandInstruction(parser.comp(), parser.dest(), parser.jump()))
      }
    }
    return instructions.join('\n') + '\n'
  }

  ACommandInstruction = (symbol: string) => {
    const s = this.decimal2bin(symbol)
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
