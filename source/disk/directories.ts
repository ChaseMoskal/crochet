
//
// Utilities for creating directories.
//

import * as mkdirp from "mkdirp"
const slashRegex = /\/|\\/

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
