var functionOne = function functionOne(a) {
  var b=1;

  var functionTwo = function functionTwo(){ //hoistable
      var c = 1;
      var functionThree = function functionThree(){ //not hoistable
          var d = 1
          function functionFive(){ //hoistable
            var x = x + 1
            return x
          }
          return functionFive()
      }

      function functionFour(){ //hoistable
        c = 3;
        var j = b + 2;
        return b + 2;
      }
      functionFour()
      return functionThree()
  }

  var functionThree = function functionThree(){ //not hoistable
        return;
    }

 return functionTwo();
}

module.exports = {
    functionOne: functionOne
}
