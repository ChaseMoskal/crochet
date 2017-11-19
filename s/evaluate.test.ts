
import testSuite from "./testSuite"
import evaluate from "./evaluate"

testSuite("evaluate function", t => {

	t.test("blocks with <?js and <?", async t => {
		t.equal(await evaluate("<?js()=>1?>"), "1")
		t.equal(await evaluate("<?()=>1?>"), "1")
		t.equal(await evaluate("<?()=>\n1\n?>"), "1", "multiline blocks")
	})

	t.test("a value", async t => {
		t.equal(await evaluate("abc <?2+2?> xyz"), "abc 4 xyz")
	})

	t.test("nothing", async t => {
		t.equal(await evaluate("abc"), "abc")
	})

	t.test("twice", async t => {
		t.equal(await evaluate("abc <?2+2?> and <?4*4?> xyz"), "abc 4 and 16 xyz")
	})

	t.test("an arrow function", async t => {
		t.equal(await evaluate("abc <?()=>2+2?> xyz"), "abc 4 xyz")
	})

	t.test("a normal function", async t => {
		t.equal(await evaluate("abc <?function(){return 2+2}?> xyz"), "abc 4 xyz")
	})

	t.test("a promise", async t => {
		t.equal(await evaluate("<?()=>new Promise(r=>setTimeout(()=>r(9),10))?>"), "9")
	})

	t.test("an async function", async t => {
		t.equal(await evaluate(
			"abc <?async function(){return new Promise(r=>setTimeout(()=>r(9),10))}?> xyz"),
			"abc 9 xyz"
		)
	})

	t.test("context provided to function", async t => {
		t.equal(await evaluate("<?context=>context.lol?>", {lol: "rofl"}), "rofl")
	})

	t.test("context value provided", async t => {
		t.equal(await evaluate("<?context.lol?>", {lol: "rofl"}), "rofl")
	})
})
