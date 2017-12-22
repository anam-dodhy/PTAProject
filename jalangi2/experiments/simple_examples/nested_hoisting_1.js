//Can be hoisted

function outerFun (x,y,z){
   function innerFunc (a){
   return a*a;
   }
   return x+y+z+ innerFunc (2);
}
outerFun (1 ,2 ,3);

/*module.exports = {
    outerFun: outerFun
}*/
