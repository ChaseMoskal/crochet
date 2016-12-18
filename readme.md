
Crochet
=======

### *What if you could write javascript in any text file?*

Templating languages and static side generators feel overcomplicated, and involve too much learning domain-specific languages and minutae. I wanted a minimalistic toolkit which works entirely with my pre-existing skillset as a JavaScript developer, and makes it easy to use straigtforward javascript as my templating language, like PHP.

Crochet is a small toolkit which helps you click together your own static site generator (or whatever). Crochet isn't a monolithic tool. It's a minimalistic number of purpose-driven tools which help with writing little scripts to statically generate websites.

Crochet is written in TypeScript, so that it remains rigidly awesome, type definitions are awesome, and accurate API docs can be generated in the future. For now, if you want to understand Crochet's API, consider reading the `.d.ts` files or the source code itself.

### Crochet's `evaluate` function:

  - **evaluate** — take your input text, and render any inline javascript blocks `<?'which look like this'?>` in-place. You can provide a `context` object, which can contain any valid javascript construct, including values and functions.

### Crochet's handy disk IO utilities:

  - **glob** — get a bunch of filenames that match your glob
  - **read** — read a file
  - **write** — write a file
  - **readAll** — read files matching your glob
  - **writeAll** — write a bunch of files


Example
-------

  1. `npm install --save-dev crochet`

### template.html

    <!doctype html>
    <html>
      <head>
        <title>

          <? context.title || "untitled page" ?>

        </title>
      <head>
      <body>
        <main>

          <? (context) => {
            return context.main || "no main content found"
              // Any javascript is valid.
              // The context object can be provided with functions.
          } ?>

        </main>
      </body>
    </html>

### generate-awesome-website.ts

    import { evaluate, read, readAll, writeAll } from "crochet"

    (async function() {

      // Read the template.
      const template = await read("template.html").content

      // Read the markdown sources.
      const sources = await readAll("articles/**/*.md")

      // Render articles.
      const articles = sources.map(source => ({

        // Destined for the build directory.
        path: `build/${source.path}`,

        // Evaluation of <?js ?> javascript blocks, with `source` provided as context.
        main: evaluate(template, source)
      }))

      // Write the articles.
      await writeAll(articles)
    })()
