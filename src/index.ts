import fs from 'fs'

import { Assembler } from './assembler'

const assemble = (asmPath: string) => {
  const code = fs.readFileSync(asmPath, { encoding: 'utf8' })
  const assembler = new Assembler(code)
  console.log(assembler.build())
}

assemble(process.argv[2])
