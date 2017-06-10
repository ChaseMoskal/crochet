
import Crochet from "./crochet"
import testSuite from "./testSuite"
import {ReadFileReport, WriteFileMandate} from "./files"

/**
 * Common constants for tests to share
 */
const common = {
  crochetOptions: {
    srcdir: "s",
    outdir: "o",
  },
  pagesOptions: {
    pages: <ReadFileReport[]>[
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
    ],
    template: <ReadFileReport>{
      filepath: "s/templates/page.html",
      content: "<? context.frontmatter.title ?> // <? context.x ?> // <? context.content ?>"
    },
    context: {x: 4}
  }
}

/**
 * Test suite for Crochet pages
 */
testSuite("crochet pages", t => {

  t.test("markdown renders correctly", async t => {
    const crochet = new Crochet(common.crochetOptions)
    const outputFiles = await crochet.pages({
      ...common.pagesOptions,
      template: {
        ...common.pagesOptions.template,
        content: "<? context.content ?>"
      }
    })

    const alphaPage = outputFiles.find(file => /alpha/.test(file.filepath))
    const betaPage = outputFiles.find(file => /beta/.test(file.filepath))

    t.equals(alphaPage.content.trim(), "<h1 id=\"alpha-heading\">Alpha heading</h1>", "alpha markdown renders")
    t.equals(betaPage.content.trim(), "<h1 id=\"beta-heading\">Beta heading</h1>", "beta markdown renders")
  })

  t.test("frontmatter title renders", async t => {
    const crochet = new Crochet(common.crochetOptions)
    const outputFiles = await crochet.pages({
      ...common.pagesOptions,
      template: {
        ...common.pagesOptions.template,
        content: "<? context.frontmatter.title ?>",
      }
    })

    const alphaPage = outputFiles.find(file => /alpha/.test(file.filepath))
    const betaPage = outputFiles.find(file => /beta/.test(file.filepath))

    t.equals(alphaPage.content.trim(), "alpha title", "alpha frontmatter renders")
    t.equals(betaPage.content.trim(), "beta title", "beta frontmatter renders")
  })

  t.test("provided context renders", async t => {
    const crochet = new Crochet(common.crochetOptions)
    const outputFiles = await crochet.pages({
      ...common.pagesOptions,
      template: {
        ...common.pagesOptions.template,
        content: "<? context.x ?>"
      }
    })

    const alphaPage = outputFiles.find(file => /alpha/.test(file.filepath))
    const betaPage = outputFiles.find(file => /beta/.test(file.filepath))

    t.equals(alphaPage.content.trim(), "4", "alpha provided context renders")
    t.equals(betaPage.content.trim(), "4", "beta provided context renders")
  })

  t.test("output paths look good", async t => {
    const crochet = new Crochet(common.crochetOptions)
    const outputFiles = await crochet.pages(common.pagesOptions);

    const alphaPage = outputFiles.find(file => /alpha/.test(file.filepath))
    const betaPage = outputFiles.find(file => /beta/.test(file.filepath))

    t.equals(alphaPage.filepath, "o/pages/alpha/index.html", "alpha output filepath is correct")
    t.equals(betaPage.filepath, "o/pages/beta/index.html", "beta output filepath is correct")
  })
})
