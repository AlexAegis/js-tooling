# @alexaegis/prettier

This package provides a very opinionated `.prettierrc` and a `.prettierignore`
definitions. Upon installing it it will copy `.prettierrc` and `.prettierignore`
into the root of your workspace and `.prettierignore` will also be copied to all
your workspace folders where there isn't. If any of these files are already
defined, it will only overwrite them if they are marked.
