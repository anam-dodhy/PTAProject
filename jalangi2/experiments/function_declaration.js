/*function functionChild3(){
  console.log("globalChild3")
}*/

function functionParent(a) { // hoistable
  var b = 1;
  function functionChild1(a) { //not hoistable
    return a + "Child1";
  }
  function functionChild2() { //not hoistable
    var b = b + "CHild2";   // var should be there for jalangi to detect
    function functionChild3(){ // not hoistable
     var c = "localChild3 ";
    }
    return functionChild3()
  }
  function functionChild3(){ // hoistable
    console.log("Another Child3")
  }
 functionChild1();
 functionChild3();
 return functionChild2();
}

module.exports = {
    functionParent: functionParent
}
