function functionParent(a) {
  var b=1;

  function functionChild() {
    return a + 1;
  }

  function functionChild2() {
    return a + 1;
  }

 return functionChild2();
}

module.exports = {
    functionParent: functionParent
}
