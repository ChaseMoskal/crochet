
import * as fs from "fs"
import * as cglob from "glob"
import * as matter from "gray-matter"

/**
 * Glob for files.
 * Return array of file paths matching the provided glob pattern.
 * Just the 'glob' tool from npm, wrapped up with a handy promise interace.
 */
export async function glob(pattern: string, options: cglob.IOptions = {}): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    cglob(pattern, options, (error: Error, matches: string[]) => {
      if (error) reject(error)
      else resolve(matches)
    })
  })
}

/**
 * Read a file.
 * Return a report including the path, preamble, and content.
 * Preamble is optional YAML or JSON frontmatter.
 */
export async function read(path: string): Promise<FileReadReport> {
  return new Promise<FileReadReport>((resolve, reject) => {
    fs.readFile(path, "utf8", (error, rawtext) => {
      if (error)
        reject(error)
      else {
        const { data, content } = matter(rawtext)
        return resolve({
          path,
          preamble: data,
          content
        })
      }
    })
  })
}

/**
 * Write a file.
 * Provide a 'mandate' object, which includes the 'path' and 'content' to write.
 */
export async function write(mandate: FileWriteMandate): Promise<void> {
  const {path, content} = mandate
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(path, (error: NodeJS.ErrnoException) => {
      if (error) reject (error)
      else resolve()
    })
  })
}

/**
 * Read all files which match your glob pattern.
 * Return a report for each file.
 */
export async function readAll(pattern: string): Promise<FileReadReport[]> {
  const paths = await glob(pattern)
  const reports = paths.map(read)
  return Promise.all(reports)
}

/**
 * Write all files described by your array of mandates.
 */
export async function writeAll(mandates: FileWriteMandate[]): Promise<void> {
  await Promise.all(mandates.map(write))
}

/**
 * Mandate to write a file.
 */
export interface FileWriteMandate {
  path: string
  content: string
}

/**
 * Report of a read file.
 */
export interface FileReadReport extends FileWriteMandate {
  path: string
  content: string
  preamble: any
}
