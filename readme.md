
# what if you could just start writing javascript in any text file?

**template.html**

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
              // The context object passed in can even contain functions.
          } ?>

        </main>
      </body>
    </html>

**crocodile.ts**


    import { evaluate, read, readAll, writeAll } from "crocodile"

    (async function() {

      // Read the template.
      const template = await read("template.html").main

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
