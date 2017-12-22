//Cannot be hoisted

 function outerFun (x,y,z){
   r= y-z;
     function innerFunc (v){
       return v;
     }
  return x+y+r+ innerFunc (2);
}

function innerFunc (b){
   return b *2;
}
innerFunc (4);
outerFun (1 ,2 ,3);
