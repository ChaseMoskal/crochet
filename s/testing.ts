
import * as bluetape from "blue-tape"

export interface TSuite {
  (suitelabel: string, suitefunc: (t: bluetape.Test) => void): void
  skip: any
}

/**
 * Re-skin of `blue-tape` module, for my own personal preferences
 *  - designed to be used with `faucet`
 *  - prefixes suite label to each case
 *  - uppercase the main suite label
 *  - bullet point indent cases
 */
export const tsuite = <TSuite>((suitelabel: string, suitefunc: (t: bluetape.Test) => void) => bluetape(
  suitelabel.toUpperCase(),
  t => suitefunc({
    ...t,
    test: (testlabel, testfunc) => t.test(` ∙ ${testlabel}`, testfunc)
  })
))

tsuite.skip = (...whatever: any[]) => {}
