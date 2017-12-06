function functionParent(a) {
  var b=1;

  function functionChild() {
    return a + 1;
  }

  function functionChild3() {
    a = a+1;
    function functionChild4(){
      a= a+3;
    }
    return functionChild4()
  }

 functionChild();
 return functionChild3();
}

module.exports = {
    functionParent: functionParent
}
