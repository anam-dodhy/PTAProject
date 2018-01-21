var functionOne = function (a) {
  var b=1;

  var functionTwo = function (){ //not hoistable
      var b = a +1;
      var functionThree = function (){ //not hoistable
          var b = b + 1
          function functionFive(){ //hoistable
            var c = c + 1
            return c
          }
          return functionFive()
      }

      function functionFour(){ //hoistable
        var c = 3;
        var b = b+ 2;
        return b
      }
      functionFour()
      return functionThree()
  }
 return functionTwo();
}

module.exports = {
    functionOne: functionOne
}
