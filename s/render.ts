
import {ReadFileReport, WriteFileMandate} from "./files"

export interface RenderOptions {
  articles: ReadFileReport[]
  template: ReadFileReport
  pathTransformer: (path: string, page: ReadFileReport) => string
  contentTransformer: (content: string, page: ReadFileReport) => Promise<string>
}

export default async function render({
  articles,
  template,
  pathTransformer,
  contentTransformer
}: RenderOptions): Promise<WriteFileMandate[]> {
  return Promise.all(articles.map(async page => (<WriteFileMandate>{
    filepath: pathTransformer(page.filepath, page),
    content: await contentTransformer(page.content, page)
  })))
}
