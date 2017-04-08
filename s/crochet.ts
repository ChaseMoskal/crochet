
export interface CrochetOptions {
  root: string
}

export default class Crochet {
  root: string

  constructor({root = "."}: CrochetOptions) {
    this.root = root
  }

  async pages({template, source, out, home, context}: CrochetPagesOptions) {}

  async blog({template, source, out, context}: CrochetBlogOptions) {}
}

export interface CrochetPagesOptions {
  template: string
  source: string
  out: string
  home: string
  context: any
}

export interface CrochetBlogOptions {
  template: string
  source: string
  out: string
  context: any
}
