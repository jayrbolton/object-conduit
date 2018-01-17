var test = require('tape')
var flyd = require('flyd')
var conduit = require('..')

test('counter example', function (t) {
  var input = {
    click: flyd.stream()
  }
  function count (inp) {
    return {
      sum: flyd.scan((sum) => sum + 1, 0, inp.click)
    }
  }
  function fibPairs (inp) {
    return {
      fibPairs: flyd.scan(([x, y]) => [y, x + y], [0, 1], inp.click)
    }
  }
  function fib (inp) {
    return {
      fib: flyd.scan((_, [x, y]) => x, 0, inp.fibPairs)
    }
  }
  var out = conduit(input, [count, fibPairs, fib])
  input.click(true)
  input.click(true)
  input.click(true)
  input.click(true)
  t.strictEqual(out.sum(), 4)
  t.deepEqual(out.fibPairs(), [3, 5])
  t.strictEqual(out.fib(), 3)
  t.end()
})
