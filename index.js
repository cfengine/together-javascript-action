const core = require('@actions/core');
const github = require('@actions/github');
const context = github.context;

async function run() {
const myToken = core.getInput('myToken');
// use myToken: ${{ secrets.GITHUB_TOKEN }} in your workflow
const octokit = github.getOctokit(myToken);
//console.log(github);
req = {
  owner: context.payload.repository.owner.login,
  repo: context.payload.repository.name,
  pull_number: context.payload.pull_request.number
};
//console.log("req is ", req);
const { data: pullRequest } = await octokit.rest.pulls.get(
  req
);
//console.log("pullRequest is ", pullRequest);

body = pullRequest.body;
          refs = {};
//          console.log("found body=",body);
          const regexp = /https:\/\/github.com\/cfengine\/([a-z]*)\/pull\/(\d*)/g;
          const matches = body.matchAll(regexp);
          for (const match of matches) {
core.setOutput(match[1], "refs/pull/" + match[2] + "/head");
          }
}

run();
