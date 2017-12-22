//Cannot be hoisted

function outerFun (x,y,z){
   r= y-z;
   function innerFunc (v){
   return v*r;
   }
   return x+y+r+ innerFunc (2);
}
outerFun (1 ,2 ,3);
/*module.exports = {
    outerFun: outerFun
}*/
