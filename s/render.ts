
import {ReadReport, WriteMandate} from "./files"

export interface RenderOptions {
  articles: ReadReport[]
  template: ReadReport
  pathTransformer: (path: string, page: ReadReport) => string
  contentTransformer: (content: string, page: ReadReport) => Promise<string>
}

export default async function render({
  articles,
  template,
  pathTransformer,
  contentTransformer
}: RenderOptions): Promise<WriteMandate[]> {
  return Promise.all(articles.map(async page => (<WriteMandate>{
    filepath: pathTransformer(page.filepath, page),
    content: await contentTransformer(page.content, page)
  })))
}
