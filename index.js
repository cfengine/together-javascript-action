const core = require('@actions/core')
const github = require('@actions/github')
const context = github.context

async function run () {
  if (context.payload.pull_request == null) {
    // not a pull request, probably a merge action, so action should use defaults, usually 'master'
    return
  }
  const myToken = core.getInput('myToken')
  // use myToken: ${{ secrets.GITHUB_TOKEN }} in your workflow
  const octokit = github.getOctokit(myToken)
  console.log("github object is ", github);
  const req = {
    owner: context.payload.repository.owner.login,
    repo: context.payload.repository.name,
    pull_number: context.payload.pull_request.number
  }
  // console.log("req is ", req);
  const { data: pullRequest } = await octokit.rest.pulls.get(
    req
  )
  console.log("pullRequest is ", pullRequest);

  const body = pullRequest.body
  //          console.log("found body=",body);
  const regexp = /https:\/\/github.com\/cfengine\/([A-Za-z0-9_.-]*)\/pull\/(\d*)/g
  let matches = []
  if (body) {
    matches = body.matchAll(regexp)
  }
  for (const match of matches) {
    core.setOutput(match[1], 'refs/pull/' + match[2] + '/merge')
    console.log(`added ${match[1]} => refs/pull/${match[2]}/merge`);
  }
  core.setOutput(context.payload.repository.name, context.ref);
  console.log(`added pull request ref ${context.payload.repository.name} => ${context.ref}`);
}

run()
