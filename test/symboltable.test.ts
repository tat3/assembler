import chai from 'chai'

import { SymbolTable } from '../src/symboltable'

const expect = chai.expect

describe('symbol table test', () => {
  it('can be initiated', () => {
    const symbol = new SymbolTable()
    expect(symbol).not.to.be.null
    expect(symbol.symbolTable).to.deep.equal({})
  })

  it('add symbol with addEntry', () => {
    const symbol = new SymbolTable()
    symbol.addEntry('i', 1024)
    expect(symbol.symbolTable).to.deep.equal({i: 1024})
    expect(() => symbol.addEntry('i', 1000)).to.throw('symbol "i" is already contained in address 1024')
  })

  it('check whether table contains symbol with contains', () => {
    const symbol = new SymbolTable()
    symbol.addEntry('i', 1024)
    expect(symbol.contains('i')).to.be.true
    expect(symbol.contains('j')).to.be.false
  })

  it('find address of symbol with getAddress', () => {
    const symbol = new SymbolTable()
    symbol.addEntry('i', 1024)
    expect(symbol.getAddress('i')).to.equal(1024)
    expect(() => symbol.getAddress('j')).to.throw('symbol "j" is not contained yet')
  })
})
