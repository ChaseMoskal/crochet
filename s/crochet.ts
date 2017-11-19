
import render from "./render"
import evaluate from "./evaluate"
import {extensionless} from "./paths"
import {ReadFileReport, WriteFileMandate} from "./files"

import * as marked from "marked"
import {join, relative, dirname, basename, extname} from "path"

export interface CrochetOptions {
	srcdir: string
	outdir: string
}

export interface PagesOptions {
	pages: ReadFileReport[]
	template: ReadFileReport
	context: Object
}

export default class Crochet {
	private readonly srcdir: string
	private readonly outdir: string

	constructor(options: CrochetOptions) {
		this.srcdir = options.srcdir
		this.outdir = options.outdir
	}

	async pages(options: PagesOptions): Promise<WriteFileMandate[]> {
		const {pages: articles, template, context} = options
		const {srcdir, outdir} = this

		return render({
			articles,
			template,

			pathTransformer: path => join(
				outdir,
				relative(
					srcdir,
					join(
						dirname(path),
						basename(extensionless(path)),
						"index" + extname(template.filepath)
					)
				)
			),

			// render javascript in the template with evaluate
			contentTransformer: async (content, page) => await evaluate(template.content, {

				// include page details in evaluate context
				...page,

				// include the provided mixin context
				...context,

				// render markdown
				content: marked(content)
			})
		})
	}
}
