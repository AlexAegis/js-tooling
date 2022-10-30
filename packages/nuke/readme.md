# @alexaegis/nuke

A simple cli command that will attemt to clear a workspace. It can also do
partial cleaning where it keeps your dependencies intact. By default it also
deletes your `node_modules` and `package-lock.json` files too. It also scans
through your workspaces too.

## Options

```sh
--keep-node-modules - skip removing node_modules
```
