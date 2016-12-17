
import * as cglob from "glob"

/**
 * Return array of file paths matching the provided glob pattern.
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
 * Read a file, and its frontmatter.
 */
export async function read(path: string): Promise<FileReadReport> {
  return Promise.resolve(null)
}

/**
 * Write a file, based on the provided mandate.
 */
export async function write(mandate: FileWriteMandate): Promise<void> {
  return Promise.resolve(null)
}

/**
 * Read multiple files, provide a glob.
 */
export async function readAll(pattern: string): Promise<FileReadReport[]> {
  const paths = await glob(pattern)
  const reports = paths.map(read)
  return Promise.all(reports)
}

/**
 * Write multiple files, given an array of mandates.
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
  frontmatter: any
}
