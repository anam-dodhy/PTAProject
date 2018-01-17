var indirectEval = eval;
var a = 0;
function func(a) {
  //console.log(a);
  var a = 2;
  //function fn(m){
    indirectEval('function g() {console.log(a); return a + 1; }');
    return g();
  //}
  //return fn(2);
}

