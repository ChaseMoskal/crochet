
/** Regular expression for parsing js blocks ("<?js ?>" tags) */
const regex = /<\?(?:js|)([\s\S]*?)\?>/igm

/** Magic token used internally temporarily */
const token = "<@@-CROCHET-TOKEN-@@>"

/**
 * Evaluate blocks of javascript in-place within the provided 'input' string
 * Each block is provided the given 'context' object, which can have javascript values and functions
 * WARNING: `eval` is used!
 */
export default async function evaluate(input: string, context: Object = {}): Promise<string> {

  // if there's nothing to evaluate, just return the input
  if (!regex.test(input)) return input

  // evaluate and invoke each javascript snippet with context
  const evaluations = await Promise.all(

    // obtain array of blocks
    input.match(regex)

      // flip null and undefined to empty string
      .map(block => block ? block : "")

      // narrow each block down to its pure javascript snippet
      .map(block => block.match(new RegExp(regex.source, "im"))[1])

      // evaluate each javascript snippet
      .map(script => eval(`(${script})`))

      // invoke the value if it's a function
      .map(value => (typeof value === "function")
        ? value(context)
        : (value) ? value : ""
      )
  )

  // start with a tokenized version of the input
  let final = input.replace(regex, token)

  // with each evaluation, replace the next token
  for (const evaluation of evaluations)
    final = final.replace(token, evaluation.toString())

  // return the finalized copy with evaluations in place
  return final
}
