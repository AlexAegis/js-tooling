# @alexaegis/prettier

This package provides a very opinionated `.prettierrc` and a `.prettierignore`
definitions. Upon installing it it will symlink `.prettierrc` and
`.prettierignore` into the root of your workspace and `.prettierignore` will
also be symlinked to all your workspace folders where there isn't. If any of
these files are already defined, it won't overwrite them.

If you wish to override some settings you can define an actual file, import
this there and extend it.
