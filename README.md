# Test or Type?

I created this repository while preparing for a talk I submitted to some conferences. In that talk, I will start with a well-tested (58 tests passing) version of Tic-Tac-Toe implemented in pure JavaScript. I will show how adding types step-by-step can make tests redundant and remove most of the tests.

The remaining tests only check whether the game shows the correct status message to the user - for this status message, I did not find a way to check it with a type yet.

## Steps

You can find everything I did during this refactoring in the commit history of this repository - I tried to write meaningful commit messages. I also wrote down some notes about what I did in [Steps.md](Steps.md). But this document does not contain a full description of how the added types work - It only contains my notes that I need to prepare the talk.

## Talk

Do you want me to give this talk at your conference or meetup? [Shoot me an email](mailto:business@davidtanzer.net) or [contact me on Twitter](https://twitter.com/dtanzer)!

## Inspiration

This little project was inspired by a conversation with Peter Kofler and others, the original blog post about "type-tac-toe" and two very different implementations in Typescript:

* [The original blog post](https://chrispenner.ca/posts/type-tac-toe) that describes how to implement type-tac-toe in Haskell
* [A blog post](https://www.hoppinger.com/blog/playing-tic-tac-toe-help-advanced-types-typescript/) that shows how one can implement tic-tac-toe **only** in the type system, with no production code whatsoever
* [A GitHub gist](https://gist.github.com/gcanti/4edc2c46b37fb86cdf1234469d9734cc) with an implementation in TypeScript

## License

    Copyright 2020 David Tanzer - business@davidtanzer.net

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

[See the full text for more details](./LICENSE).
