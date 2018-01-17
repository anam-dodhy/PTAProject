function functionChild4(){
	
}

function functionParent(a) {
  var b=1;
  
  function functionChild(a) { //not hoistable
    return a + "Child";
  }

  
  function functionChild3() { //not hoistable
    b = b + "CHild3";
    function functionChild4(){
      a = a + "Child4";
    }
    return functionChild4()
  }

 functionChild();
 functionChild4();
 return functionChild3();
}

module.exports = {
    functionParent: functionParent
}
