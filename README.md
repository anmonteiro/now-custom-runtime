# now-custom-runtime

This package provides a
[builder](https://zeit.co/docs/v2/deployments/builders/overview#when-to-use-builders)
for Zeit's [Now 2.0](https://zeit.co/blog/now-2) offering that enables running
custom runtimes in AWS Lambda.

## Usage

Your `now.json` `"builds"` section should look something like this:

## Example

**Note**: don't forget to add `"version": 2` in your `now.json` file to use Now
2.0 explicitly.

```json
{
  "builds": [
    {
      "src": "my_executable",
      "use": "now-custom-runtime"
    }
  ]
}
```

### Other Examples

Make sure to check the [`examples`](./examples) folder in this repo for examples.

## Limitations

- The
  [`maxLambdaSize`](https://zeit.co/docs/v2/deployments/concepts/lambdas/#maximum-bundle-size)
  setting defaults to 25MB. You can override this (up to a limit of 50MB) in the
  builder config, e.g.:

```json
{
  "builds": [
    {
      "src": "my_executable",
      "use": "now-static-bin",
      "config": {
        "maxLambdaSize": "50mb"
        ^^^ NEW
      }
    }
  ]
}
```

## Copyright and License

Copyright © 2018 António Nuno Monteiro.

Distributed under the MIT License (see [LICENSE](./LICENSE)).
