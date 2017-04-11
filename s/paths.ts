

//
// Utilities for handling file and directory paths, filenames, and extensions
//
//   - filename
//   - extensionless
//

import * as path from "path"

/**
 * Remove the extension from a filepath or filename
 */
export function extensionless(filepath: string) {
  return filepath.replace(/\.[^/.]+$/, "")
}

/**
 * Function to get the filename portion of a path
 * Synonym for `path.basename`
 */
export const filename = path.basename
