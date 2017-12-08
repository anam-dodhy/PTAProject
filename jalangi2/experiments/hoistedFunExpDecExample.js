var functionOne = function functionOne(a) {
  var b=1;

  var functionTwo = function functionTwo(){
      b = a +1;
      var functionThree = function functionThree(){
          b + 1
          function functionFive(){
            c = c + 1
            return c
          }
          return functionFive()
      }

      function functionFour(){
        c = 3;
        return b + 2;
      }
      functionFour()
      return functionThree()
  }
 return functionTwo();
}

module.exports = {
    functionOne: functionOne
}
