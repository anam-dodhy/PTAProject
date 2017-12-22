//Can be hoisted

function innerFunc (a){
   return a*a;
   }
   function outerFun (x,y,z){
   return x+y+z+ innerFunc (2);
}
outerFun (1 ,2 ,3);
/*module.exports = {
    outerFun: outerFun
}*/
