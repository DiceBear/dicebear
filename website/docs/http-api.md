---
title: HTTP-API
slug: /docs/http-api
---

Our free HTTP-API is the easiest way to use Avatars. Just use the following URL as image source.

    https://avatars.dicebear.com/api/:sprites/:seed.svg

Replace `:sprites` with `male`, `female`, `human`, `identicon`, `initials`, `bottts`, `avataaars`, `jdenticon`, `gridy`. The value of `:seed` can be anything you
like - but **don't** use any sensitive or personal data here!

The used [avatar style](/styles) may have additional options that can be set with GET parameters.
For example, to create a happy _male_ avatar with the seed `john`, the following URL can be used:

    https://avatars.dicebear.com/api/male/john.svg?mood=happy