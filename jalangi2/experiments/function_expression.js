var functionOne = function functionOne(a) {
  var b=1;

  var functionTwo = function functionTwo(){ //not hoistable
      b = a +1;
      var functionThree = function functionThree(){ //not hoistable
          b = b + 1
          function functionFive(){ //hoistable
            c = c + 1
            return c
          }
          return functionFive()
      }

      function functionFour(){ //not hoistable
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
