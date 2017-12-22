//Cannot be hoisted

function outerFun (x,y,z){
   function innerFunc (){
   return x*x;
   }
   return x+y+z+ innerFunc ();
}
outerFun (1 ,2 ,3);
/*module.exports = {
    outerFun: outerFun
}*/
