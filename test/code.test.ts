import chai from 'chai'

import { Code } from '../src/code'

const expect = chai.expect

describe('mnemonic to binary translator test', () => {
  it('can be initiated', () => {
    const code = new Code()
    expect(code).not.to.be.null
  })

  it('translate dest code', () => {
    const code = new Code()
    const tests = [
      ['null', '000'],
      ['M', '001'],
      ['D', '010'],
      ['MD', '011'],
      ['A', '100'],
      ['AM', '101'],
      ['AD', '110'],
      ['AMD', '111'],
    ]
    const errTests = ['nullA', 'ADM', 'MA', 'DA', 'DAM', 'DM', 'DMA']
    tests.forEach(test => expect(code.destCode(test[0])).to.equal(test[1]))
    errTests.forEach(test => expect(() => code.destCode(test)).to.throw('invalid dest mnemonic: ' + test))
  })

  it('translate comp code', () => {
    const code = new Code()
    const tests = [
      ['0', '0101010'],
      ['1', '0111111'],
      ['-1', '0111010'],
      ['D', '0001100'],
      ['A', '0110000'],
      ['M', '1110000'],
      ['!D', '0001100'],
      ['!A', '0110001'],
      ['!M', '1110001'],
      ['-D', '0001111'],
      ['-A', '0110011'],
      ['-M', '1110011'],
      ['D+1', '0011111'],
      ['A+1', '0110111'],
      ['M+1', '1110111'],
      ['D-1', '0001110'],
      ['A-1', '0110010'],
      ['M-1', '1110010'],
      ['D+A', '0000010'],
      ['D+M', '1000010'],
      ['D-A', '0010011'],
      ['D-M', '1010011'],
      ['A-D', '0000111'],
      ['M-D', '1000111'],
      ['D&A', '0000000'],
      ['D&M', '1000000'],
      ['D|A', '0010101'],
      ['D|M', '1010101'],
    ]
    const errTests = ['sum+M', '0+A', '2', 'A+B', '+A', 'A+M', 'M+D']
    tests.forEach(test => expect(code.compCode(test[0])).to.equal(test[1]))
    errTests.forEach(test => expect(() => code.compCode(test)).to.throw('invalid comp mnemonic: ' + test))
  })

  it('translate comp code', () => {
    const code = new Code()
    const tests = [
      ['0', '0101010'],
      ['1', '0111111'],
      ['-1', '0111010'],
      ['D', '0001100'],
      ['A', '0110000'],
      ['M', '1110000'],
      ['!D', '0001100'],
      ['!A', '0110001'],
      ['!M', '1110001'],
      ['-D', '0001111'],
      ['-A', '0110011'],
      ['-M', '1110011'],
      ['D+1', '0011111'],
      ['A+1', '0110111'],
      ['M+1', '1110111'],
      ['D-1', '0001110'],
      ['A-1', '0110010'],
      ['M-1', '1110010'],
      ['D+A', '0000010'],
      ['D+M', '1000010'],
      ['D-A', '0010011'],
      ['D-M', '1010011'],
      ['A-D', '0000111'],
      ['M-D', '1000111'],
      ['D&A', '0000000'],
      ['D&M', '1000000'],
      ['D|A', '0010101'],
      ['D|M', '1010101'],
    ]
    const errTests = ['sum+M', '0+A', '2', 'A+B', '+A', 'A+M', 'M+D']
    tests.forEach(test => expect(code.compCode(test[0])).to.equal(test[1]))
    errTests.forEach(test => expect(() => code.compCode(test)).to.throw('invalid comp mnemonic: ' + test))
  })

  it('translate jump code', () => {
    const code = new Code()
    const tests = [
      ['null', '000'],
      ['JGT', '001'],
      ['JEQ', '010'],
      ['JGE', '011'],
      ['JLT', '100'],
      ['JNE', '101'],
      ['JLE', '110'],
      ['JMP', '111']
    ]
    const errTests = ['', 'JUMP']
    tests.forEach(test => expect(code.jumpCode(test[0])).to.equal(test[1]))
    errTests.forEach(test => expect(() => code.jumpCode(test)).to.throw('invalid jump mnemonic: ' + test))
  })
})
