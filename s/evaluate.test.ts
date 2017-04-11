
import * as test from "tape"
import evaluate from "./evaluate"

test("evaluate blocks with <?js and <?", async function(t) {
  t.plan(3)
  t.equal(await evaluate("<?js()=>1?>"), "1")
  t.equal(await evaluate("<?()=>1?>"), "1")
  t.equal(await evaluate("<?()=>\n1\n?>"), "1", "multiline blocks")
})

test("evaluate a value", async function(t) {
  t.plan(1)
  t.equal(await evaluate("abc <?2+2?> xyz"), "abc 4 xyz")
})

test("evaluate twice", async function(t) {
  t.plan(1)
  t.equal(await evaluate("abc <?2+2?> and <?4*4?> xyz"), "abc 4 and 16 xyz")
})

test("evaluate an arrow function", async function(t) {
  t.plan(1)
  t.equal(await evaluate("abc <?()=>2+2?> xyz"), "abc 4 xyz")
})

test("evaluate a normal function", async function(t) {
  t.plan(1)
  t.equal(await evaluate("abc <?function(){return 2+2}?> xyz"), "abc 4 xyz")
})

test("evaluate a promise", async function(t) {
  t.plan(1)
  t.equal(await evaluate("<?()=>new Promise(r=>setTimeout(()=>r(9),10))?>"), "9")
})

test.skip("evaluate an async function", async function(t) {
  t.plan(1)
  t.equal(await evaluate(
    "abc <?async function(){return new Promise(r=>setTimeout(()=>r(9),10))}?> xyz"),
    "abc 9 xyz"
  )
})

test("evaluate provides context to function", async function(t) {
  t.plan(1)
  t.equal(await evaluate("<?context=>context.lol?>", {lol: "rofl"}), "rofl")
})

test("evaluate provides context to value", async function(t) {
  t.plan(1)
  t.equal(await evaluate("<?context.lol?>", {lol: "rofl"}), "rofl")
})
