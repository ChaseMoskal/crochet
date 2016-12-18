
declare module "gray-matter" {

  type MatterOptions = any

  interface MatterReport {
    orig: string
    data: any
    content: string
  }

  function matter(input: string, options?: MatterOptions): MatterReport

  namespace matter {}
  export = matter
}
