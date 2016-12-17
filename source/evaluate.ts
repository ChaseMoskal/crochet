
/** Regular expression for parsing crocodile blocks ("<?js ?>" tags). */
const regex = /<\?(?:js|)(.*?)\?>/ig

/** Magic token used internally temporarily. */
const token = "<@@-CROCODILE-TOKEN-@@>"

/**
 * Evaluate crocodile blocks of javascript with a given context.
 */
export default async function evaluate(input: string, context?: Object): Promise<string> {

  // Evaluate and invoke each javascript snippet with context.
  const evaluations = await Promise.all(

    // Obtain array of blocks.
    input.match(regex)

      // Narrow each block down to its pure javascript snippet.
      .map(block => block.match(new RegExp(regex.source, "i"))[1])

      // Evaluate each javascript snippet.
      .map(script => eval(`(${script})`))

      // Invoke the value if it's a function.
      .map(value => (typeof value === "function")
        ? value(context)
        : (value) ? value : ""
      )
  )

  // Start with a tokenized version of the input.
  let final = input.replace(regex, token)

  // With each evaluation, replace the next token.
  for (const evaluation of evaluations)
    final = final.replace(token, evaluation.toString())

  // Return the finalized copy with evaluations in place.
  return final
}
