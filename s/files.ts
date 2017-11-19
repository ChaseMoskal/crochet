
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
			else resolve(matches)
		})
	})
}

/**
 * Report of a file that was read
 */
export interface ReadFileReport {
	filepath: string
	content: string
	frontmatter: any
}

/**
 * Mandate to write a file
 */
export interface WriteFileMandate {
	filepath: string
	content: string
}

/**
 * Read a file
 * Return a report including the filepath, preamble, and content
 * Preamble is optional YAML or JSON frontmatter
 */
export async function readFile(filepath: string): Promise<ReadFileReport> {
	return new Promise<ReadFileReport>((resolve, reject) => {
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
 * Write a text file
 * Provide a 'mandate' object, which includes the 'filepath' and 'content' to write
 */
export async function writeFile(mandate: WriteFileMandate): Promise<void> {
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
export async function copyFile(sourcePath: string, destinationPath: string): Promise<void> {
	await writeFile({
		filepath: destinationPath,
		content: (await readFile(sourcePath)).content
	})
}

/**
 * Read files of the provided glob, or array of filepaths
 */
export async function readFiles(filepaths: string | string[]): Promise<ReadFileReport[]> {
	if (typeof filepaths === "string") return readFiles(await glob(filepaths))
	else return Promise.all(filepaths.map(readFile))
}

/**
 * Write all files described by your array of mandates
 */
export async function writeFiles(mandates: WriteFileMandate[]): Promise<void> {
	await Promise.all(mandates.map(writeFile))
}
