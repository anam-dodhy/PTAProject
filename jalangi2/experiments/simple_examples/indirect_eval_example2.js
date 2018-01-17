x = 3;
y = 5;
function test() {
    var x = 2, y = 4;
    console.log(eval('x + y'));  // Direct call, uses local scope, result is 6
    var geval = eval; // equivalent to calling eval in the global scope
    console.log(geval('x + y')); // Indirect call, uses global scope, throws ReferenceError because `x` is undefined
    //(0, eval)('x + y'); // another example of Indirect call
  }
  test();