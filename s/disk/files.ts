
//
// Utilities for finding, reading, and writing files
//

import {mkdirForFile} from "./directories";

import * as fs from "fs"
import * as cglob from "glob"
import * as matter from "gray-matter"

/**
 * Glob for files
 * Return array of filepaths matching the provided glob pattern
 * Promise wrapper for the npm 'glob' module
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
 * Report of a file that was read
 */
export interface ReadReport {
  filepath: string
  content: string
  frontmatter: any
}

/**
 * Mandate to write a file
 */
export interface WriteMandate {
  filepath: string
  content: string
}

/**
 * Read a file
 * Return a report including the filepath, preamble, and content
 * Preamble is optional YAML or JSON frontmatter
 */
export async function read(filepath: string): Promise<ReadReport> {
  return new Promise<ReadReport>((resolve, reject) => {
    fs.readFile(filepath, "utf8", (error, rawtext) => {
      if (error)
        reject(error)
      else {
        const {data, content} = (<any>matter)(rawtext)
        return resolve({
          filepath,
          frontmatter: data,
          content
        })
      }
    })
  })
}

/**
 * Write a file
 * Provide a 'mandate' object, which includes the 'filepath' and 'content' to write
 */
export async function write(mandate: WriteMandate): Promise<void> {
  const {filepath, content} = mandate

  // Make directories for the file.
  await mkdirForFile(filepath)

  // Promise-wrap the 'fs' node module.
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(filepath, content, (error: NodeJS.ErrnoException) => {
      if (error) reject (error)
      else resolve()
    })
  })
}

/**
 * Copy a text file, but without the preamble
 */
export async function copy(sourcePath: string, destinationPath: string): Promise<void> {
  await write({
    filepath: destinationPath,
    content: (await read(sourcePath)).content
  })
}

/**
 * Read the files of the provided paths
 */
export async function readAll(filepaths: string[]): Promise<ReadReport[]> {
  return Promise.all(filepaths.map(read))
}

/**
 * Read files matching the provided glob pattern
 */
export async function readGlob(pattern: string): Promise<ReadReport[]> {
  return readAll(await glob(pattern))
}

/**
 * Write all files described by your array of mandates
 */
export async function writeAll(mandates: WriteMandate[]): Promise<void> {
  await Promise.all(mandates.map(write))
}
