function functionParent(a) {
  var b=1;

  function functionChild(a) {
    return a + "Child";
  }

  function functionChild3() {
    b = b+"CHild3";
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
