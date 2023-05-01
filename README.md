# together-javascript-action

## Purpose
This action will search the current pull request's description
and search for URLs mentioning other PRs of the form

https://github.com/cfengine/repo-name/pull/pull-number

And then set outputs for later use based on that repo name
with the value of `refs/pull/pull-number/merge`.

TODO: If the PR referenced is no longer available: error out.

## Usage
In your workflow use this action to get any related pulls as git ref paths.
The `ref:` attribute in action/checkout, if empty, will default to the default branch, which typically is not what we want for workflows that operate on non-default branches.
`github.base_ref` is only set during a `pull_request` event and is needed in case of a non-default branch.
`github.ref` is the appropriate ref to use during a merge workflow as it will refer to the branch in which we just merged.

For public repos you can use a `uses` element:

```
    steps: 
      - name: Get Togethers
        uses: cfengine/together-javascript-action@v1.4
        id: together
        with:
          myToken: ${{ secrets.GITHUB_TOKEN }}
      - name: Checkout Core
        uses: actions/checkout@v3
        with:
          repository: cfengine/core
          path: core
          ref: ${{steps.together.outputs.core || github.base_ref || github.ref}}
          submodules: recursive
```

For private repos you must checkout the action.

NOTE: it is critical that you place the together action checkout FIRST in your steps.
Otherwise that checkout will replace/overwrite previous checkouts and cause trouble.

```
    steps:
      - name: Checkout Together Action
        uses: actions/checkout@v3
        with:
          repository: cfengine/together-javascript-action
          ref: v1.4
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
          ref: ${{steps.together.outputs.core || github.base_ref || github.ref}}
          submodules: recursive
      - name: Checkout My Private Repo
        uses: actions/checkout@v3
        with:
          path: my-private-repo
          ref: ${{steps.together.outputs.my-private-repo || github.base_ref || github.ref}}
```


## Development

When you want to release a new version of this action do the following:

```
git tag -a -m "My awesome new feature" vN.M
git push --follow-tags
```

Then you will have to visit all of the workflows that use this action and upgrade their version as appropriate.
