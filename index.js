module.exports = conduit

function conduit (input, fns) {
  var out = {}
  for (var i = 0; i < fns.length; ++i) {
    // The function may mutate object, but we want to make sure to preserve the original for merging
    var obj = fns[i](input)
    for (var name in obj) {
      input[name] = obj[name]
      out[name] = obj[name]
    }
  }
  return out
}
