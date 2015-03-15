# How to Contribute

<img src="./4jhan.png" align="left" height="150" width="150"/>

Support in fixing bugs, improving on existing features, suggesting new features, etc. is welcome, since it is a open source project after all. However a certain code standard should be maintained, which will be specified in this document.

**Before starting I would like to point out that all patches, issues, and so on, all go though Github, therefore a Github account is required.**

### Project structure

To understand this section, one should be familiar with the concept of Git's branching model. The structure used here resembles the [feature branch workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow).

The default branch, the `master` branch should always be stable enough for normal usage. All features should be tested to be compatible within the less stable `testing` branch.

If `master` is considered *super* stable, it's major version tagged.

### Reporting an issue

If you discover an error, check the issues page on Github if someone has already discussed or noticed it. If not, please feel free to create a push request on `testing` or report it, if you can't fix it yourself.

### Adding or requesting a feature

If want to implement a feature, fork the project and use `testing` (important), create a new branch and do your magic. Create a pull request, compare your branch to `testing`. If successful, it will be merged into the code.
