/*function outerFun1 (y){
  r= y -2;
  function innerFunc1_1 (v){
    return v*r;
  }
  function innerFunc1_2 (v){
    return v*y;
  }
  return y+r+ innerFunc1_1 (2)+ innerFunc1_2 (3);
}*/

outerFun2 (3);

function outerFun2 (a){
  function innerFunc2_1 (b){
    return b*b
  }
  return innerFunc2_1 (3)+ a;
}
