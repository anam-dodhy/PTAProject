//Can be hoisted

function outerFun (x,y,z){
   function innerFunc (a){ 
	return a*a;
   }
	return x+y+z+ innerFunc (2);
}

module.exports = {
    outerFun: outerFun
}
