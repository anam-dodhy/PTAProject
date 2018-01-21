/*function functionChild3(){
  console.log("globalChild3")
}*/

function functionParent(a) {
  var b = 1;
  function functionChild1(a) { //not hoistable
    return a + "Child1";
  }
  function functionChild2() { //not hoistable
    b = b + "CHild2";
    console.log("***In functionChild2: ",b);
    function functionChild3(){ // not hoistable
      c = "localChild3 ";
    }
    return functionChild3()
  }
  function functionChild3(){
    console.log("Another Child3")
  }
 functionChild1();
 functionChild3();
 return functionChild2();
}

module.exports = {
    functionParent: functionParent
}
