
import {FileReadReport, FileWriteMandate} from "./files"

export interface RenderOptions {
  articles: FileReadReport[]
  template: FileReadReport
  pathTransformer: (path: string, page: FileReadReport) => string
  contentTransformer: (content: string, page: FileReadReport) => Promise<string>
}

export default async function render({
  articles,
  template,
  pathTransformer,
  contentTransformer
}: RenderOptions): Promise<FileWriteMandate[]> {
  return Promise.all(articles.map(async page => (<FileWriteMandate>{
    filepath: pathTransformer(page.filepath, page),
    content: await contentTransformer(page.content, page)
  })))
}
