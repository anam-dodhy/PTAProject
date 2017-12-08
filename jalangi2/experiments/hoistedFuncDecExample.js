function functionParent(a) {
  var b=1;

  function functionChild(b) {
    return a + "Child";
  }

  function functionChild3() {
    a = a+"CHild3";
    function functionChild4(){
      a= a+"Child4";
    }
    return functionChild4()
  }

 functionChild();
 return functionChild3();
}

module.exports = {
    functionParent: functionParent
}
