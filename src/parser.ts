export const A_COMMAND = 'A_COMMAND'
export const C_COMMAND = 'C_COMMAND'
export const L_COMMAND = 'L_COMMAND'

const errMsg = 'could not find next command.'

export class ACommand {
  commandType = A_COMMAND
  constructor(public symbol: string) {
  }
}

export class CCommand {
  commandType = C_COMMAND
  constructor(public dest: string | null, public comp: string, public jump: string | null) {
  }
}

export class LCommand {
  commandType = L_COMMAND
  constructor(public symbol: string) {
  }
}

export class Parser {
  commands: string[]
  current: string | null
  next: string | null

  constructor(public code: string) {
    const commands = code.split('\n')
    this.commands = commands
    this.current = null
    this.next = null
  }

  advance = () => {
    if (this.commands.length === 0) {
      throw new Error(errMsg)
    }
    let i = 0
    while (this.ignoreCommand(this.commands[i])) {
      i++
      if (i === this.commands.length) {
        throw new Error(errMsg)
      }
    }
    this.current = this.commands[i]
    this.commands = this.commands.slice(i+1)
  }

  skipSpace = (command: string) => {
    return command.replace(/^( +)/, '')
  }

  ignoreCommand = (command: string) => {
    const noSpace = this.skipSpace(command)
    const ignore = noSpace === '' || noSpace.startsWith('//')
    return ignore
  }

  hasMoreCommands = () => {
    return this.commands.length > 0
  }

  findCommand = () => {
    if (this.current === null) {
      this.advance()
    }
    if (this.current === null) {
      throw new Error(errMsg)
    }
    const current = this.skipSpace(this.current)

    const a_match = current.match(/@([a-zA-Z0-9_]+).*/)
    if (a_match) {
      return new ACommand(a_match[1])
    }

    const l_match = current.match(/\(([a-zA-Z0-9_]+)\)/)
    if (l_match) {
      return new LCommand(l_match[1])
    }

    const c_match = current.match(/(?:(A?M?D?)=)?([a-zA-Z0-9+\-&|_]+)(?:;([a-zA-Z]+))?/)
    if (c_match) {
      return new CCommand(
        c_match[1] || null,
        c_match[2],
        c_match[3] || null)
    }
    throw new Error('no command type matched: ' + current)
  }

  commandType = () => {
    return this.findCommand().commandType
  }

  symbol = () => {
    const command = this.findCommand()
    if (command.commandType === A_COMMAND) {
      return (command as ACommand).symbol
    } else if (command.commandType === L_COMMAND) {
      return (command as LCommand).symbol
    } else {
      throw new Error('command is not A_COMMAND nor L_COMMAND')
    }
  }

  currentCCommand = () => {
    const command = this.findCommand()
    if (command.commandType !== C_COMMAND) {
      throw new Error('command is not C_COMMAN')
    }
    return command as CCommand
  }

  dest = () => this.currentCCommand().dest

  comp = () => this.currentCCommand().comp

  jump = () => this.currentCCommand().jump
}
