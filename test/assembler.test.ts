import chai from 'chai'
import fs from 'fs'

import { Assembler } from '../src/assembler'

const expect = chai.expect

describe('assembler module test', () => {
  it('can be initiated', () => {
    const code = ''
    const assembler = new Assembler(code)
    expect(assembler).not.to.be.null
    expect(assembler.code).to.equal(code)
  })

  it('build assembly to binary', () => {
    const code = 'D=A'
    const bin = `1110110000010000
`
    const assembler = new Assembler(code)
    expect(assembler.build()).to.equal(bin)
  })

  it('build assembly to binary', () => {
    const code = 'D=A'
    const bin = `1110110000010000
`
    const assembler = new Assembler(code)
    expect(assembler.build()).to.equal(bin)
  })

  it('build add assembly file', () => {
    const code = fs.readFileSync('test/data/add/Add.asm', { encoding: 'utf8' })
    const bin = fs.readFileSync('test/data/add/Add.hack', { encoding: 'utf8' })
    const assembler = new Assembler(code)
    expect(assembler.build()).to.equal(bin)
  })

  it('convert decimal to binary', () => {
    const code = ''
    const assembler = new Assembler(code)
    expect(assembler.decimal2bin('0')).to.equal('0')
    expect(assembler.decimal2bin('10')).to.equal('1010')
  })

  it('build max assembly file', () => {
    const code = fs.readFileSync('test/data/max/Max.asm', { encoding: 'utf8' })
    const bin = fs.readFileSync('test/data/max/Max.hack', { encoding: 'utf8' })
    const assembler = new Assembler(code)
    expect(assembler.build()).to.equal(bin)
  })
})
