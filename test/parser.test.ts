import chai from 'chai'

import { Parser } from '../src/parser'

const expect = chai.expect

describe('parser test', () => {
  it('can be initiated', () => {
    const code = ''
    const p = new Parser(code)
    expect(p).not.to.be.null
  })
})

