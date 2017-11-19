/*

this file is a hack on top of blue-tape

just for my own personal preferences

to make the tape/faucet output the prettiest

*/

import * as bluetape from "blue-tape"

export interface TSuite {
	(suitelabel: string, suitefunc: (t: bluetape.Test) => void): void
	skip: any
}

/**
 * Re-skin of `blue-tape` module
 *  - designed to be used with `faucet`
 *  - prefixes suite label to each case
 *  - uppercase the main suite label
 *  - bullet point indent cases
 */
export const testSuite = <TSuite>((suitelabel: string, suitefunc: (t: bluetape.Test) => void) => bluetape(
	suitelabel.toUpperCase(),
	t => suitefunc({
		...t,
		test: (testlabel, testfunc) => t.test(` ∙ ${testlabel}`, testfunc)
	})
))

testSuite.skip = (...whatever: any[]) => {}

export default testSuite
