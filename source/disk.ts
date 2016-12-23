
import * as fs from "fs"
import * as path from "path"
import * as cglob from "glob"
import * as mkdirp from "mkdirp"
import * as matter from "gray-matter"

const slashRegex = /\/|\\/

/**
 * Glob for files.
 * Return array of file paths matching the provided glob pattern.
 * Promise wrapper for the npm 'glob' module.
 */
export async function glob(pattern: string, options: cglob.IOptions = {}): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    cglob(pattern, options, (error: Error, matches: string[]) => {
      if (error) reject(error)
      else {
        resolve(matches)
      }
    })
  })
}

/**
 * Make directories.
 * Promise wrapper for the 'mkdirp' npm module.
 */
export async function mkdir(dirpath: string) {
  return new Promise<void>((resolve, reject) => {
    mkdirp(dirpath, (error: Error) => {
      if (error) reject(error)
      else resolve()
    })
  })
}

/**
 * Make directories for a given file path.
 * Assumes the last segment is the file name, every segment before that is a directory.
 */
export async function mkdirForFile(filepath: string) {

  // No slash, no directories to make.
  if (!slashRegex.test(filepath))
    return

  // Separate the filename from the dirpath.
  const segments = filepath.split(slashRegex)
  const filename = segments.pop()
  const dirpath = segments.join("/")

  // Make directories.
  await mkdir(dirpath)
}

/**
 * Remove the extension from a filepath or filename.
 */
export function extensionless(filepath: string) {
  return filepath.replace(/\.[^/.]+$/, "")
}

/** Get the filename portion of a path. Synonym for `path.basename`. */
export const filename = path.basename

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

  // Make directories for the file.
  await mkdirForFile(path)

  // Promise-wrap the 'fs' node module.
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(path, content, (error: NodeJS.ErrnoException) => {
      if (error) reject (error)
      else resolve()
    })
  })
}

/**
 * Copy a text file, but without the preamble.
 */
export async function copy(sourcePath: string, destinationPath: string): Promise<void> {
  write({
    path: destinationPath,
    content: (await read(sourcePath)).content
  });
}

/**
 * Read the files of the provided paths.
 */
export async function readAll(paths: string[]): Promise<FileReadReport[]> {
  return Promise.all(paths.map(read))
}

/**
 * Read files matching the provided glob pattern.
 */
export async function readGlob(pattern: string): Promise<FileReadReport[]> {
  return readAll(await glob(pattern))
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
