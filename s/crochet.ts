
/*

====================
~ WIP CONCEPT WORK ~
====================

*/

export interface CrochetOptions {
  root: string
}

export default class Crochet {
  root: string

  constructor({root = "."}: CrochetOptions) {
    this.root = root
    throw Error(`UNIMPLEMENTED`)
  }

  async pages({template, source, out, home, context}: CrochetPagesOptions) {
    throw Error(`UNIMPLEMENTED`)
  }

  async blog({template, source, out, context}: CrochetBlogOptions) {
    throw Error(`UNIMPLEMENTED`)
  }
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
