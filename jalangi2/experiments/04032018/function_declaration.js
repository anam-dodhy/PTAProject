function functionParent(a) { // does not need hoisting as it is root
  var b = 1;

  function functionChild3() { //not hoistable
    var z = a + "Child3";
  }

  function functionChild4() { //not hoistable
      b = b + "Child4";
  }

  function functionChild2() { //is hoistable
    var x = "Child2";

    function functionChild3(){ //is hoistable but not under functionParent()
        var y = 8;
        return
    }
    return functionChild3();
  }
 functionChild4()
 functionChild3()
 return functionChild2();
}

module.exports = {
    functionParent: functionParent
}
