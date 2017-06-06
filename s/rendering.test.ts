
/*

RENDERING TESTS
===============

 + the rendering functionality doesn't itself interact with the filesystem, so
   we don't in these tests either

    - instead, we create mock files which are just object which meet interfaces
      like `ReadReport` and `WriteMandate`, which the rendering functionality
      works with

*/

import {tsuite} from "./testing"
import {ReadReport, WriteMandate} from "./files"
import {renderArticles, renderArticleIndex} from "./rendering"

/**
 * Test suite: renderArticles
 */
tsuite("rendering — render articles", async t => {

  /**
   * Common constants for tests in this suite to share
   */
  const common = {

    // directory structure from this point will be copied to outdir
    sourcedir: "s",

    // target directory for the rendered output
    outdir: "o",

    // mock markdown files as pages
    articles: <ReadReport[]>Object.freeze([
      {
        filepath: "s/pages/alpha.md",
        frontmatter: {title: "alpha title"},
        content: "# Alpha heading"
      },
      {
        filepath: "s/pages/beta.md",
        frontmatter: {title: "beta title"},
        content: "# Beta heading"
      }
    ]),

    // mock page html template
    template: <ReadReport>Object.freeze({
      filepath: "s/templates/page.html",
      content: "<? context.frontmatter.title ?> // <? context.content ?>"
    })
  }

  /**
   * Test case
   */
  t.test("yaml title and markdown content look good", async () => {
    const {sourcedir, outdir, articles, template} = common

    // render the mock pages
    const outputFiles = await renderArticles({sourcedir, outdir, template, articles});
    t.assert(outputFiles && outputFiles.length, "output files generate")

    // grab the alpha and beta pages from the rendered output
    const alphaPage = outputFiles.find(file => /alpha/.test(file.filepath))
    const betaPage = outputFiles.find(file => /beta/.test(file.filepath))
    t.assert(alphaPage, "alpha page generates")
    t.assert(betaPage, "beta page generates")
    t.assert(/alpha/i.test(alphaPage.content), "alpha page has content")
    t.assert(/beta/i.test(betaPage.content), "beta page has content")

    // ensure markdown rendered correctly
    t.equals(alphaPage.content.trim(), "alpha title // <h1 id=\"alpha-heading\">Alpha heading</h1>", "alpha markdown renders nicely")
    t.equals(betaPage.content.trim(), "beta title // <h1 id=\"beta-heading\">Beta heading</h1>", "beta markdown renders nicely")
  })

  /**
   * Test case
   */
  t.test("output filepaths look good", async () => {
    const {sourcedir, outdir, articles, template} = common
    const outputFiles = await renderArticles({sourcedir, outdir, template, articles});
    const alphaPage = outputFiles.find(file => /alpha/.test(file.filepath))
    const betaPage = outputFiles.find(file => /beta/.test(file.filepath))

    // ensure output filepaths are correct
    t.equals(alphaPage.filepath, "o/pages/alpha/index.html", "alpha output filepath is correct")
    t.equals(betaPage.filepath, "o/pages/beta/index.html", "beta output filepath is correct")
  })
})

declare const render: any

tsuite.skip("rendering — render", async t => {
  const output = render()
})

tsuite.skip("rendering — render", async t => {
  
})

// TODOSKIP

// /**
//  * Test to render a blog index page
//  */
// test.skip("render blog index", async t => {

//   // mock markdown article files
//   const articles = <ReadReport[]>[
//     {
//       filepath: "s/blog/1.alpha.md",
//       frontmatter: {title: "alpha title"},
//       content: "# Alpha heading"
//     },
//     {
//       filepath: "s/blog/2.beta.md",
//       frontmatter: {title: "beta title"},
//       content: "# Beta heading"
//     }
//   ]

//   // mock blog template html
//   const template = <ReadReport>{
//     filepath: "s/template/blog-index.html",
//     content: "<? context.articles.length ?>"
//   }

//   // render the blog index
//   const blogIndexPage = await renderArticleIndex({
//     sourcedir: "s",
//     articles,
//     template,
//     outdir: "o"
//   });

//   t.assert(blogIndexPage)
//   t.assert(blogIndexPage.content === "2")
// })
