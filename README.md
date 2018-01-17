# object-conduit

> Compose functions that take and return objects by continuously merging

## Usage

```js
var conduit = require('object-conduit')
```

The following example uses [flyd](https://github.com/paldepind/flyd) streams. Say we have a silly app where a user clicks a button, and we want to keep a simple counter, plus a fibonacci counter, for every click they make.

We can define a couple functions, `count` and `fib`, like so:

```js
function count (inp) {
  return {
    sum: flyd.scan((sum) => sum + 1, 0, inp.click)
  }
}
function fib (inp) {
  // Keep a stream of fib pairs
  const fibPairs = flyd.scan(([x, y]) => [y, x + y], [0, 1], inp.click)
  return {
    fib: flyd.scan((_, [x, y]) => x, 0, fibPairs)
  }
}
```

Each function takes an input object of streams and returns an output object of streams. The output object gets merged back with the input object after it's returned, so you don't lose any input streams. For example, the result of `fib` will get merged back with its input, so the result object has both `sum` and `fib` in it.

You can access any key in the input object and it will be a flyd stream. If it hasn't been previously defined in another function, then it will still be a stream. For example, we could access `inp.xyz` to get a flyd stream in either function (although it wouldn't be useful as it's not used anywhere).

We chain together streams, one after the other, using, the conduit function:

```js
var input = {click: flyd.stream()}
var out = conduit(input, [count, fib])
```

That gives us a final object with all the properties we defined in each function: `.sum`, and `.count`, which both read from the stream in `.click`.

To use this object of streams (for example, in a view), you can push to some streams in the object to get corresponding values out of other streams.

```js
out.click(true)
out.click(true)
out.click(true)
out.click(true)
out.click(true)
out.click(true)
t.strictEqual(out.sum(), 6)
t.strictEqual(out.fib(), 8) // 0, 1, 1, 3, 5, 8
```

## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install object-conduit
```

## See Also

- [`flyd`](https://github.com/paldepind/flyd)

## License

MIT

