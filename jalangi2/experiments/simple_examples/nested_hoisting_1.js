//Can be hoisted

function outerFun (x,y,z){
   function innerFunc (a){
   return a*a;
   }
   return x+y+z+ innerFunc (2);
}
val = outerFun (1 ,2 ,3);
console.log(val);

/*module.exports = {
    outerFun: outerFun
}*/
