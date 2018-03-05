
function parent() {
  function child1(){
    var x = 2, y = 4;
    console.log(eval('function directEval() {console.log("In function g: "); return; }'));  // Direct call, uses local scope, result is 6

    return directEval();
  }


  return child1();
}

module.exports = {
  parent: parent
}