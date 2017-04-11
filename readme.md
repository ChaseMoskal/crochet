
Crochet — *write javascript anywhere*
=====================================

> ## PRE-RELEASE WARNING
>
> Crochet API surface area is violent, turbulent waters.
>
> This tool is finding itself, so until the v1.0.0 release, assume the worst.

### `npm install --save-dev crochet`

  - **JavaScript as a templating language.**  
    Inject JavaScript into any file with `<?js ?>` or `<? ?>` tags, syntactically like PHP.  
    When you render a template, you provide a context object.  
    *A contrived example:*

        <div>
          <strong> <?context.fullName?> <strong>
          <a href="mailto:<?context.email?>"> <?context.email?> </a>
          <ul>
            <?js
              context.fetchItemsByTag(context.tag)
                .then(items => items.map(item => `<li>${ item.label }</li>`))
                .then(items => items.join(""))
            ?>
          </ul>
        </div>

  - **A minimalistic toolbox.**  
    Purpose-driven utilities which help you statically generate websites.

  - **Written in TypeScript.** Code hint details available if you're using VSCode.

### `import evaluate from "crochet/o/evaluate"`

  - **evaluate(input: string, context?: Object): Promise\<string\>**  
    Render inline javascript blocks `<?'which look like this'?>`.  
    You can provide a `context` object, which can contain any valid javascript, including values and functions.  
    [evaluate.ts source code.](./s/evaluate.ts)

### `import { glob, mkdir, read, readGlob, readAll, write, copy } from "crochet/o/disk"`

  - **Disk IO utilities** including *glob, mkdir, read, write, copy, readGlob, writeAll*  
    [disk.ts source code.](./s/disk.ts)

--------

Usage example:
--------------

#### template.html

    <!doctype html>
    <html>
      <head>
        <title>

          <? context.title || "untitled page" ?>

        </title>
      <head>
      <body>
        <main>

          <? function(context) {
            return context.content || "no content found"
              // Any javascript is valid
              // The context object can have values and functions
          } ?>

        </main>
      </body>
    </html>

#### generate-awesome-website.ts

    import evaluate from "crochet/o/evaluate"
    import {read, readAll, writeAll} from "crochet/o/files"

    // Immediately invoked function generates the site
    (async function() {

      // Read the template
      const template = await read("template.html")

      // Read the article sources
      const sources = await readAll("articles/**/*.html")

      // Write the articles
      await writeAll(sources.map(source => ({

        // Destined for the build directory
        path: `build/${source.path}`,

        // Evaluation of <?js ?> javascript blocks, with `source` provided as context
        content: evaluate(template.content, source)
      })))
    })()
