console.log(context);
console.log(github);
          body = "";
          prs = {};
          if (context.issue.body) {
            // Return issue body if present
            body = context.issue.body;
          } else {
            // Otherwise return issue body from commit
            pull_requests = await github.rest.repos.listPullRequestsAssociatedWithCommit({
                commit_sha: context.sha,
                owner: context.repo.owner,
                repo: context.repo.repo,
              });
            body = pull_requests.data[0].body;
          }
          const regexp = /https:\/\/github.com\/cfengine\/([a-z]*)\/pull\/(\d*)/g;
          const matches = body.matchAll(regexp);
          for (const match of matches) {
            prs[match[1]] = match[2];
          }
console.log(prs);
