
import {ReadReport, WriteMandate, read, write, readAll, writeAll} from "./files"
import {extensionless} from "./paths"
import evaluate from "./evaluate"

import {join, relative, dirname, basename, extname} from "path"
import * as marked from "marked"

export interface RenderOptions {
  sourcedir: string
  outdir: string
  template: ReadReport
  articles: ReadReport[]
}

export interface RenderArticlesOptions extends RenderOptions {

  /** transforms the article content, defaults to a markdown renderer */
  transformer?: (content: string) => Promise<string>
}

/**
 * Render articles of web content
 */
export async function renderArticles({
  sourcedir,
  outdir,
  template,
  articles,
  transformer = async (content: string) => marked(content),
}: RenderArticlesOptions): Promise<WriteMandate[]> {

  return Promise.all(articles.map(async article => (<WriteMandate>{

    filepath: join(
      outdir,
      relative(
        sourcedir,
        join(
          dirname(article.filepath),
          basename(extensionless(article.filepath)),
          "index" + extname(template.filepath)
        )
      )
    ),

    content: await evaluate(
      template.content,
      {...article, content: await transformer(article.content)}
    )
  })))
}

export async function renderArticleIndex(options: RenderOptions): Promise<WriteMandate> {
  return
}
