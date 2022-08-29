const core = require('@actions/core');
const github = require('@actions/github');
const _ = require('underscore');
const GitHubUtils = require('../../../libs/GithubUtils');

const issue = github.context.payload.issue ? github.context.payload.issue.number : github.context.payload.pull_request.number;
/* eslint-disable max-len */
const contributorChecklist = `#### Contributor (PR Author) Checklist
- [ ] I linked the correct issue in the \`### Fixed Issues\` section above
- [ ] I wrote clear testing steps that cover the changes made in this PR
    - [ ] I added steps for local testing in the \`Tests\` section
    - [ ] I added steps for Staging and/or Production testing in the \`QA steps\` section
    - [ ] I added steps to cover failure scenarios (i.e. verify an input displays the correct error message if the entered data is not correct)
    - [ ] I turned off my network connection and tested it while offline to ensure it matches the expected behavior (i.e. verify the default avatar icon is displayed if app is offline)
- [ ] I included screenshots or videos for tests on [all platforms](https://github.com/Expensify/App/blob/main/contributingGuides/CONTRIBUTING.md#make-sure-you-can-test-on-all-platforms)
- [ ] I ran the tests on **all platforms** & verified they passed on:
    - [ ] iOS / native
    - [ ] Android / native
    - [ ] iOS / Safari
    - [ ] Android / Chrome
    - [ ] MacOS / Chrome
    - [ ] MacOS / Desktop
- [ ] I verified there are no console errors (if there's a console error not related to the PR, report it or open an issue for it to be fixed)
- [ ] I followed proper code patterns (see [Reviewing the code](https://github.com/Expensify/App/blob/main/contributingGuides/PR_REVIEW_GUIDELINES.md#reviewing-the-code))
    - [ ] I verified that any callback methods that were added or modified are named for what the method does and never what callback they handle (i.e. \`toggleReport\` and not \`onIconClick\`)
    - [ ] I verified that comments were added to code that is not self explanatory
    - [ ] I verified that any new or modified comments were clear, correct English, and explained "why" the code was doing something instead of only explaining "what" the code was doing.
    - [ ] I verified any copy / text shown in the product was added in all \`src/languages/*\` files
    - [ ] I verified any copy / text that was added to the app is correct English and approved by marketing by tagging the marketing team on the original GH to get the correct copy.
    - [ ] I verified proper file naming conventions were followed for any new files or renamed files. All non-platform specific files are named after what they export and are not named "index.js". All platform-specific files are named for the platform the code supports as outlined in the README.
    - [ ] I verified the JSDocs style guidelines (in [\`STYLE.md\`](https://github.com/Expensify/App/blob/main/contributingGuides/STYLE.md#jsdocs)) were followed
- [ ] If a new code pattern is added I verified it was agreed to be used by multiple Expensify engineers
- [ ] I followed the guidelines as stated in the [Review Guidelines](https://github.com/Expensify/App/blob/main/contributingGuides/PR_REVIEW_GUIDELINES.md)
- [ ] I tested other components that can be impacted by my changes (i.e. if the PR modifies a shared library or component like \`Avatar\`, I verified the components using \`Avatar\` are working as expected)
- [ ] I verified all code is DRY (the PR doesn't include any logic written more than once, with the exception of tests)
- [ ] I verified any variables that can be defined as constants (ie. in CONST.js or at the top of the file that uses the constant) are defined as such
- [ ] If a new component is created I verified that:
    - [ ] A similar component doesn't exist in the codebase
    - [ ] All props are defined accurately and each prop has a \`/** comment above it */\`
    - [ ] Any functional components have the \`displayName\` property
    - [ ] The file is named correctly
    - [ ] The component has a clear name that is non-ambiguous and the purpose of the component can be inferred from the name alone
    - [ ] The only data being stored in the state is data necessary for rendering and nothing else
    - [ ] For Class Components, any internal methods passed to components event handlers are bound to \`this\` properly so there are no scoping issues (i.e. for \`onClick={this.submit}\` the method \`this.submit\` should be bound to \`this\` in the constructor)
    - [ ] Any internal methods bound to \`this\` are necessary to be bound (i.e. avoid \`this.submit = this.submit.bind(this);\` if \`this.submit\` is never passed to a component event handler like \`onClick\`)
    - [ ] All JSX used for rendering exists in the render method
    - [ ] The component has the minimum amount of code necessary for its purpose, and it is broken down into smaller components in order to separate concerns and functions
- [ ] If a new CSS style is added I verified that:
    - [ ] A similar style doesn't already exist
    - [ ] The style can't be created with an existing [StyleUtils](https://github.com/Expensify/App/blob/main/src/styles/StyleUtils.js) function (i.e. \`StyleUtils.getBackgroundAndBorderStyle(themeColors.componentBG\`)
- [ ] If the PR modifies a generic component, I tested and verified that those changes do not break usages of that component in the rest of the App (i.e. if a shared library or component like \`Avatar\` is modified, I verified that \`Avatar\` is working as expected in all cases)
- [ ] If the PR modifies a component related to any of the existing Storybook stories, I tested and verified all stories for that component are still working as expected.
- [ ] I have checked off every checkbox in the PR author checklist, including those that don't apply to this PR.`;

const contributorPlusChecklist = `- [ ] I have verified the author checklist is complete (all boxes are checked off).
- [ ] I verified the correct issue is linked in the \`### Fixed Issues\` section above
- [ ] I verified testing steps are clear and they cover the changes made in this PR
    - [ ] I verified the steps for local testing are in the \`Tests\` section
    - [ ] I verified the steps for Staging and/or Production testing are in the \`QA steps\` section
    - [ ] I verified the steps cover any possible failure scenarios (i.e. verify an input displays the correct error message if the entered data is not correct)
    - [ ] I turned off my network connection and tested it while offline to ensure it matches the expected behavior (i.e. verify the default avatar icon is displayed if app is offline)
- [ ] I checked that screenshots or videos are included for tests on [all platforms](https://github.com/Expensify/App/blob/main/contributingGuides/CONTRIBUTING.md#make-sure-you-can-test-on-all-platforms)
- [ ] I verified tests pass on **all platforms** & I tested again on:
    - [ ] iOS / native
    - [ ] Android / native
    - [ ] iOS / Safari
    - [ ] Android / Chrome
    - [ ] MacOS / Chrome
    - [ ] MacOS / Desktop
- [ ] I verified there are no console errors (if there's a console error not related to the PR, report it or open an issue for it to be fixed)
- [ ] I verified proper code patterns were followed (see [Reviewing the code](https://github.com/Expensify/App/blob/main/contributingGuides/PR_REVIEW_GUIDELINES.md#reviewing-the-code))
    - [ ] I verified that any callback methods that were added or modified are named for what the method does and never what callback they handle (i.e. \`toggleReport\` and not \`onIconClick\`).
    - [ ] I verified that comments were added to code that is not self explanatory
    - [ ] I verified that any new or modified comments were clear, correct English, and explained "why" the code was doing something instead of only explaining "what" the code was doing.
    - [ ] I verified any copy / text shown in the product was added in all \`src/languages/*\` files
    - [ ] I verified any copy / text that was added to the app is correct English and approved by marketing by tagging the marketing team on the original GH to get the correct copy.
    - [ ] I verified proper file naming conventions were followed for any new files or renamed files. All non-platform specific files are named after what they export and are not named "index.js". All platform-specific files are named for the platform the code supports as outlined in the README.
    - [ ] I verified the JSDocs style guidelines (in [\`STYLE.md\`](https://github.com/Expensify/App/blob/main/contributingGuides/STYLE.md#jsdocs)) were followed
- [ ] If a new code pattern is added I verified it was agreed to be used by multiple Expensify engineers
- [ ] I verified that this PR follows the guidelines as stated in the [Review Guidelines](https://github.com/Expensify/App/blob/main/contributingGuides/PR_REVIEW_GUIDELINES.md)
- [ ] I verified other components that can be impacted by these changes have been tested, and I retested again (i.e. if the PR modifies a shared library or component like \`Avatar\`, I verified the components using \`Avatar\` have been tested & I retested again)
- [ ] I verified all code is DRY (the PR doesn't include any logic written more than once, with the exception of tests)
- [ ] I verified any variables that can be defined as constants (ie. in CONST.js or at the top of the file that uses the constant) are defined as such
- [ ] If a new component is created I verified that:
    - [ ] A similar component doesn't exist in the codebase
    - [ ] All props are defined accurately and each prop has a \`/** comment above it */\`
    - [ ] Any functional components have the \`displayName\` property
    - [ ] The file is named correctly
    - [ ] The component has a clear name that is non-ambiguous and the purpose of the component can be inferred from the name alone
    - [ ] The only data being stored in the state is data necessary for rendering and nothing else
    - [ ] For Class Components, any internal methods passed to components event handlers are bound to \`this\` properly so there are no scoping issues (i.e. for \`onClick={this.submit}\` the method \`this.submit\` should be bound to \`this\` in the constructor)
    - [ ] Any internal methods bound to \`this\` are necessary to be bound (i.e. avoid \`this.submit = this.submit.bind(this);\` if \`this.submit\` is never passed to a component event handler like \`onClick\`)
    - [ ] All JSX used for rendering exists in the render method
    - [ ] The component has the minimum amount of code necessary for its purpose, and it is broken down into smaller components in order to separate concerns and functions
- [ ] If a new CSS style is added I verified that:
    - [ ] A similar style doesn't already exist
    - [ ] The style can't be created with an existing [StyleUtils](https://github.com/Expensify/App/blob/main/src/styles/StyleUtils.js) function (i.e. \`StyleUtils.getBackgroundAndBorderStyle(themeColors.componentBG\`)
- [ ] If the PR modifies a generic component, I tested and verified that those changes do not break usages of that component in the rest of the App (i.e. if a shared library or component like \`Avatar\` is modified, I verified that \`Avatar\` is working as expected in all cases)
- [ ] If the PR modifies a component related to any of the existing Storybook stories, I tested and verified all stories for that component are still working as expected.
- [ ] I have checked off every checkbox in the PR reviewer checklist, including those that don't apply to this PR.`;

GitHubUtils.octokit.issues.listComments({
    owner: GitHubUtils.GITHUB_OWNER,
    repo: GitHubUtils.APP_REPO,
    issue_number: issue,
    per_page: 100,
}).then(({data}) => {
    const comments = _.map(data, comment => comment.body).toString();

    for (const [index, comment] of comments) {
        console.log(`Index: ${index} ${JSON.stringify(comment)}`);
    }

    const trimmedComment = comments.replace(/(\s|\r\n|\n|\r)/gm, '');
    const trimmedContributorChecklist = contributorChecklist.replace(/(\s|\r\n|\n|\r)/gm, '');
    const contributorChecklistComplete = trimmedComment.includes(trimmedContributorChecklist);

    const diff = (diffMe, diffBy) => diffMe.split(diffBy).join('');

    if (!contributorChecklistComplete) {
        console.error('Contributor checklist is not completely filled out. Please check every box to verify you\'ve thought about the item.');
        console.error(diff(trimmedComment, trimmedContributorChecklist));
        core.setFailed('Contributor checklist is not completely filled out. Please check every box to verify you\'ve thought about the item.');
        return;
    }

    const trimmedContributorPlusChecklist = contributorPlusChecklist.replace(/(\s|\r\n|\n|\r)/gm, '');
    const contributorPlusChecklistComplete = trimmedComment.includes(trimmedContributorPlusChecklist);

    if (!contributorPlusChecklistComplete) {
        console.error('Contributor plus checklist is not completely filled out. Please check every box to verify you\'ve thought about the item.');
        console.error(diff(trimmedComment, trimmedContributorPlusChecklist));
        core.setFailed('Contributor plus checklist is not completely filled out. Please check every box to verify you\'ve thought about the item.');
        return;
    }

    console.log('All checklist are complete 🎉');
});
