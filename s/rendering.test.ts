
import * as test from "blue-tape"

import {ReadReport, WriteMandate} from "./files"
import {renderArticles, renderArticleIndex} from "./rendering"


test("render articles", async t => {

  // mock markdown files as pages
  const articles = <ReadReport[]>[
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
  ]

  // mock page html template
  const template = <ReadReport>{
    filepath: "s/templates/page.html",
    content: "<? context.frontmatter.title ?> // <? context.content ?>"
  }

  // render the mock pages
  const outputFiles = await renderArticles({
    sourcedir: "s",
    outdir: "o",
    template,
    articles
  });

  t.assert(outputFiles && outputFiles.length, "output files generate")

  const alphaPage = outputFiles.find(file => /alpha/.test(file.filepath))
  const betaPage = outputFiles.find(file => /beta/.test(file.filepath))

  t.assert(alphaPage, "alpha page generates")
  t.assert(betaPage, "beta page generates")

  t.assert(/alpha/i.test(alphaPage.content), "alpha page has content")
  t.assert(/beta/i.test(betaPage.content), "beta page has content")

  t.equals(alphaPage.content.trim(), "alpha title // <h1 id=\"alpha-heading\">Alpha heading</h1>", "alpha markdown renders nicely")
  t.equals(betaPage.content.trim(), "beta title // <h1 id=\"beta-heading\">Beta heading</h1>", "beta markdown renders nicely")
})


/**
 * Test to render a blog index page
 */
test.skip("render blog index", async t => {

  // mock markdown article files
  const articles = <ReadReport[]>[
    {
      filepath: "s/blog/1.alpha.md",
      frontmatter: {title: "alpha title"},
      content: "# Alpha heading"
    },
    {
      filepath: "s/blog/2.beta.md",
      frontmatter: {title: "beta title"},
      content: "# Beta heading"
    }
  ]

  // mock blog template html
  const template = <ReadReport>{
    filepath: "s/template/blog-index.html",
    content: "<? context.articles.length ?>"
  }

  // render the blog index
  const blogIndexPage = await renderArticleIndex({
    sourcedir: "s",
    articles,
    template,
    outdir: "o"
  });

  t.assert(blogIndexPage)
  t.assert(blogIndexPage.content === "2")
})
