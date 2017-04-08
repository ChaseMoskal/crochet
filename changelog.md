
CROCHET CHANGELOG
=================

This changelog lists changes which could be important for 
those consuming the `crochet` npm module.


v0.3.0
------

  - `source/` renamed to `s/`
  - `build/` renamed to `o/`


v0.2.0
------

  - (Breaking Change) Split disk.ts functionality up into 
    `disk/` dir:

    - `import {readAll} from "crochet/build/disk/files"`
    - `import {mkdir} from "crochet/build/disk/directories"` 


v0.1.1
------

  - Updated project dependencies.
