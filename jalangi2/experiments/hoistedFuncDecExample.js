function functionParent(a) {
  var b=1;

  function functionChild(a) {
    console.log(a + "Child");
    return a + "Child";
  }

  function functionChild3() {
    b = b + "CHild3";
    console.log("b", b);
    function functionChild4(){
      a = a + "Child4";
      console.log("a", a);
    }
    return functionChild4()
  }

 functionChild();
 return functionChild3();
}

module.exports = {
    functionParent: functionParent
}
