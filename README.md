# together-javascript-action


## Purpose
This action will search the current pull request's description
and search for URLs mentioning other PRs of the form

https://github.com/cfengine/\<repo name\>/pull/\<pull number\>

And then set outputs for later use based on that repo name
with the value of `refs/pull/\<pull number\>/merge`.

TODO: If the PR referenced is no longer available: error out.

## Usage
In your workflow you can use a ref value for checkout of either the output of this action
or 'master' if there is no given reference for that repo.

In your workflow use this action to get any related pulls as git ref paths.
For actions/checkout github action if the `ref:` attribute is empty the default value will usually make sense like the default branch.

For public repos you can use a `uses` element:

```
    steps: 
      - name: Get Togethers
        uses: cfengine/together-javascript-action@v1.3
        id: together
        with:
          myToken: ${{ secrets.GITHUB_TOKEN }}
      - name: Checkout Core
        uses: actions/checkout@v3
        with:
          repository: cfengine/core
          path: core
          ref: ${{steps.together.outputs.core}}
          submodules: recursive

For private repos you must checkout the action:

```
    steps:
      - name: Checkout Together Action
        uses: actions/checkout@v3
        with:
          repository: cfengine/together-javascript-action
          ref: v1.3
      - name: Action step
        uses: ./
        id: together
        with:
          myToken: ${{ secrets.GITHUB_TOKEN }}
      - name: Checkout Core
        uses: actions/checkout@v3
        with:
          repository: cfengine/core
          path: core
          ref: ${{steps.together.outputs.core}}
          submodules: recursive
      - name: Checkout My Private Repo
        uses: actions/checkout@v3
        with:
          path: my-private-repo
          ref: ${{steps.together.outputs.my-private-repo}}
```


## Development

When you want to release a new version of this action do the following:

```
git tag -a -m "My awesome new feature" vN.M
git push --follow-tags
```

Then you will have to visit all of the workflows that use this action and upgrade their version as appropriate.
