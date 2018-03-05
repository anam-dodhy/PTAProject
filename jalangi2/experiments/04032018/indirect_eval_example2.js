x = 3;
var geval = eval;
function parent() {
  function child1(){
    var x = 2, y = 4;
    console.log(eval('x + y'));  // Direct call, uses local scope, result is 6
     // equivalent to calling eval in the global scope
    geval('function indirectEval() {var y = 10; console.log("In function g: ",x); function indirectChild(){return y;} return indirectChild(); }'); // Indirect call, uses global scope, throws ReferenceError because `x` is undefined
    //(0, eval)('x + y'); // another example of Indirect call
    function child2(){
      return indirectEval();
    }
    return child2();
  }
  return child1();
}

module.exports = {
  parent: parent
}