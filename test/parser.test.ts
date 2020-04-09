import chai from 'chai'

import { Parser, A_COMMAND, L_COMMAND, C_COMMAND } from '../src/parser'
import { range } from '../src/util'

const expect = chai.expect

describe('parser test', () => {
  it('can be initiated', () => {
    const code = ''
    const p = new Parser(code)
    expect(p).not.to.be.null
    expect(p.code).to.equal(code)
  })

  it('can parse input code', () => {
    const code = `
    @i
    M=1`
    const p = new Parser(code)
    expect(p.commands).to.have.length(3)
  })

  it('advances code position', () => {
    const code = `
    @i
    M=1`
    const p = new Parser(code)
    expect(p.hasMoreCommands()).to.equal(true)

    expect(p.advance).not.throw()
    expect(p.current).not.be.null
    expect(p.current).to.equal('    @i')
    expect(p.hasMoreCommands()).to.equal(true)

    expect(p.advance).not.throw()
    expect(p.current).to.equal('    M=1')
    expect(p.hasMoreCommands()).to.equal(false)

    expect(p.advance).throw('could not find next command.')
  })

  it('returns false for empty commands', () => {
    expect(new Parser(`@1`).hasMoreCommands()).to.equal(true)
    expect(new Parser(`
    @1`).hasMoreCommands()).to.equal(true)
    const p = new Parser(``)
    p.commands = []
    expect(p.hasMoreCommands()).to.equal(false)
  })

  it('find command type of current command', () => {
    const code = `
    @i
    M=1
(LOOP)`
    const p = new Parser(code)
    expect(p.commandType()).to.equal(A_COMMAND)

    p.advance()
    expect(p.commandType()).to.equal(C_COMMAND)

    p.advance()
    expect(p.commandType()).to.equal(L_COMMAND)
  })

  it('parse address command', () => {
    const p = new Parser(`
    @1
    @a`)
    expect(p.symbol()).to.equal('1')

    p.advance()
    expect(p.symbol()).to.equal('a')
    const tests = [
      {input: '@a', output: 'a'},
      {input: '@1', output: '1'},
      {input: '@A', output: 'A'},
      {input: '@A_3', output: 'A_3'},
      {input: '@1a', output: '1a'},
    ]
    tests.forEach(test => {
      expect(new Parser(test.input).symbol()).to.equal(test.output)
    })
  })

  it('parse loop command', () => {
    const p = new Parser(`
    (LOOP)
    (END)`)
    expect(p.symbol()).to.equal('LOOP')

    p.advance()
    expect(p.symbol()).to.equal('END')
    const tests = [
      {input: '(a)', output: 'a'},
      {input: '(1)', output: '1'},
      {input: '(A)', output: 'A'},
      {input: '(0_a)', output: '0_a'},
      {input: '(1a)', output: '1a'},
    ]
    tests.forEach(test => {
      expect(new Parser(test.input).symbol()).to.equal(test.output)
    })
  })

  it('parse command command', () => {
    const p = new Parser(`
    D=A
    M=D`)
    expect(p.dest()).to.equal('D')
    expect(p.comp()).to.equal('A')
    expect(p.jump()).to.equal(null)

    p.advance()
    expect(p.dest()).to.equal('M')
    expect(p.comp()).to.equal('D')
    expect(p.jump()).to.equal(null)

    const tests = [
      {input: 'D=0', dest: 'D', comp: '0', jump: null},
      {input: 'D;JNE', dest: null, comp: 'D', jump: 'JNE'},
      {input: '1', dest: null, comp: '1', jump: null},
      {input: 'D=A-M', dest: 'D', comp: 'A-M', jump: null},
      {input: 'MD=A|D', dest: 'MD', comp: 'A|D', jump: null},
      {input: 'AMD=A&D;JMP', dest: 'AMD', comp: 'A&D', jump: 'JMP'},
    ]
    tests.forEach(test => {
      const p = new Parser(test.input)
      expect(p.dest()).to.equal(test.dest)
      expect(p.comp()).to.equal(test.comp)
      expect(p.jump()).to.equal(test.jump)
    })
  })

  it('parse asm script', () => {
    const code = `
    // define screen size
    @8192
    D=A
    @number_of_pixel
    M=D

    @R0
    M=0     // Screen is empty at the start
(LOOP)
    @KBD
    D=M
    @KEY_PUSHED
    D;JNE   // if KBD != 0 then goto KEY_PUSHED
(KEY_NOT_PUSHED)
    @R1
    M=0     // R0=0
    @CHECK_STATE_CHANGE
    0;JMP
(KEY_PUSHED)
    @R1
    M=1     // R1=1
(CHECK_STATE_CHANGE)    // if R0 != R1 then screen is update
    @R0
    D=M     // D=R0
    @R1
    D=D-M   // D=R0-R1
    @LOOP
    D;JEQ   // if D == 0 then goto LOOP
    @i
    M=0
    @R1
    D=M
    @R0
    M=D
    @EMPTY_SCREEN_LOOP
    D;JEQ
(FILL_SCREEN_LOOP)
    @i
    D=M
    @number_of_pixel
    D=M-D
    @LOOP
    D;JLT
    @SCREEN
    A=A+D
    M=-1
    @i
    MD=M+1
    @FILL_SCREEN_LOOP
    0;JMP
(EMPTY_SCREEN_LOOP)
    @i
    D=M
    @number_of_pixel
    D=M-D
    @LOOP
    D;JLT
    @SCREEN
    A=A+D
    M=0
    @i
    MD=M+1
    @EMPTY_SCREEN_LOOP
    0;JMP`
    const p = new Parser(code)
    range(62).forEach(i => p.advance())
    expect(p.advance).to.throw()
  })
})
