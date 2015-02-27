# How to Contribute

<img src="./4jhan.png" alt="4jhan" style="width: 150px;float: left; padding: 10px; padding-right: 20px;"/>
Support in fixing bugs, improving on existing features, suggesting new features, etc. is welcome, since it is a open source project after all. However a certain code standard should be maintained, which will be specified in this document.

**Before starting I would like to point out that all patches, issues, and so on, all go though Github, therefore a Github account is required.**

### Project structure

To understand this section, one should be familiar with the concept of Git's branching model. The structure used here resembles the [feature branch workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow).

The default branch, the `master` branch should always be stable enough for normal usage. All features should be tested to be compatible within the less stable `testing` branch.

Features and fixes are first implemented in separate branches, feature branches starting with `fe_`, fix or error branches starting with `er_`. They should be based of the latest commit from the `testing` branch. When everything is working as it should, it should be merged back into the `testing` branch. As soon as its sure that no problem has come from merging, `testing` is merged into `master`, just like specified earlier.

If `master` is considered *super* stable, it's major version tagged.

#### The version system

The general version system looks like this: `X.Y.Zty_NAME` ( f.e.: `1.0.0`, `2.5.14er_some-crash` )

**`X` is the major version**, every tag increments the number by one.
**`Y` is the sub-version**, every `master` commit increments it by one since the last tag.
**`Z` is the patch-version**, every `testing` commmit increases it by one since the last `master`-merge.

`ty_NAME` is either `er_` or `fe_`, indicating a feature or fix branch, followed by the branch name Tags, `master` and `testing` leave this out.

### Reporting an issue

Smaller issues like a typo in a document or a comment or other minor issues don't need a separate branch and can be directly fixed in the `testing` branch via a push request.

If you discover an error, check the issues page on Github if someone has already discussed or noticed it. If not, please feel free to report it. When confirmed a new branch will be created based on `testing`, starting with `er_` and anyone can push pull requests to try and fix it. The section above discussed what follows.

### Adding or requesting a feature

If want to implement a feature, fork the project and use `testing` (important), create a new branch starting with `fe_`, and do your magic. Create a pull request, compare your branch to `testing`. If successful, it will be merged into the code.
