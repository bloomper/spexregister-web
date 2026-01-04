# Contributing to Spexregister Web

Spexregister Web is released under the Apache 2.0 license.
If you would like to contribute something, or simply want to work with the code, this document should help you to get started.

## Code of conduct

This project adheres to the Contributor Covenant [code of conduct][1]. By participating, you are expected to uphold this code.
Please report unacceptable behavior to [spexregistret@gmail.com](spexregistret@gmail.com).

## Code conventions and housekeeping

None of these is essential for a pull request, but they will all help.

TODO
- Whenever possible, please rebase your branch against the current develop (or other target branch in the project)
- When writing a commit message please follow [these conventions][2]
  Also, if you are fixing an existing issue please add `Fixes GH-nnn` at the end of the commit message (where nnn is the issue number)

## Working with the code

### Building from source

To build the source you will need Java 21 or later.
The code is built with Gradle:

```
$ ./gradlew build
```

[1]: CODE_OF_CONDUCT.md
[2]: https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html