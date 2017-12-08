//node ../src/js/commands/jalangi.js --inlineIID --inlineSource --analysis analysis2.js mainExample.js
(function (sandbox) {

  var functionAttributes = {
    name: "",
    variables: [{
      name: "",
      isArgument: ""
    }]
  }

  var rootFunctionArguments = []
  var parentChildStack = []

    function MyAnalysis() {
        /**
         * This callback is triggered at the beginning of a scope for every local variable declared in the scope, for
         * every formal parameter, for every function defined using a function statement, for <tt>arguments</tt>
         * variable, and for the formal parameter passed in a catch statement.
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {string} name - Name of the variable that is declared
         * @param {*} val - Initial value of the variable that is declared.  Variables can be local variables, function
         * parameters, catch parameters, <tt>arguments</tt>, or functions defined using function statements.  Variables
         * declared with <tt>var</tt> have <tt>undefined</tt> as initial values and cannot be changed by returning a
         * different value from this callback.  On the beginning of an execution of a function, a <tt>declare</tt>
         * callback is called on the <tt>arguments</tt> variable.
         * @param {boolean} isArgument - True if the variable is <tt>arguments</tt> or a formal parameter.
         * @param {number} argumentIndex - Index of the argument in the function call.  Indices start from 0.  If the
         * variable is not a formal parameter, then <tt>argumentIndex</tt> is -1.
         * @param {boolean} isCatchParam - True if the variable is a parameter of a catch statement.
         * @returns {{result: *} | undefined} - If the function returns an object, then the original initial value is
         * replaced with the value stored in the <tt>result</tt> property of the object.  This does not apply to local
         * variables declared with <tt>var</tt>.
         *
         */
        this.declare = function (iid, name, val, isArgument, argumentIndex, isCatchParam) {
          //console.log ("------------declare-----------------------")
            if (val!=undefined && (val.toString().indexOf("function") > -1 || name.toString().indexOf("arguments") > -1)){ // if the function is being declared then we need to ignore it
                // do nothing
            }
            else{
              if (parentChildStack.length !=0 && isArgument == true){ //only for variables in the argument of a function
                pushVariable(name, isArgument, parentChildStack)
              }
            }
            return {result: val};
        };

        /**
         * This callback is called after a variable is read.
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {string} name - Name of the variable being read
         * @param {*} val - Value read from the variable
         * @param {boolean} isGlobal - True if the variable is not declared using <tt>var</tt> (e.g. <tt>console</tt>)
         * @param {boolean} isScriptLocal - True if the variable is declared in the global scope using <tt>var</tt>
         * @returns {{result: *} | undefined} - If an object is returned, the result of the read operation is
         * replaced with the value stored in the <tt>result</tt> property of the object.
         */
        this.read = function (iid, name, val, isGlobal, isScriptLocal) {
          if (val!=undefined && (val.toString().indexOf("function") > -1 || name.toString().indexOf("arguments") > -1)){ // if the function is being declared then we need to ignore it
              // do nothing
          }
          else{
            if (parentChildStack.length !=0){
              pushVariable(name, false, parentChildStack)
            }
          }
            return {result: val};
        };

        /**
         * This callback is called before a variable is written.
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {string} name - Name of the variable being read
         * @param {*} val - Value to be written to the variable
         * @param {*} lhs - Value stored in the variable before the write operation
         * @param {boolean} isGlobal - True if the variable is not declared using <tt>var</tt> (e.g. <tt>console</tt>)
         * @param {boolean} isScriptLocal - True if the variable is declared in the global scope using <tt>var</tt>
         * @returns {{result: *} | undefined} - If an object is returned, the result of the write operation is
         * replaced with the value stored in the <tt>result</tt> property of the object.
         */
        this.write = function (iid, name, val, lhs, isGlobal, isScriptLocal) {
          if (val!=undefined && (val.toString().indexOf("function") > -1 || name.toString().indexOf("arguments") > -1)){ // if the function is being declared then we need to ignore it
              // do nothing
          }
          else{
            if (parentChildStack.length !=0){
              pushVariable(name, false, parentChildStack)
            }
          }
          return {result: val};
        };

      function checkVariableExistance(variables, variable){
        for (var i=0; i < variables.length; i++) {
          if (variables[i].name === variable.name) {
              return true;
          }
        }
        return false
      }

      function pushVariable (name, isArgument, parentChildStack){
        var variable = {name: name, isArgument: isArgument};
        var func = parentChildStack.pop(); // take the last function
        if (!checkVariableExistance(func.variables, variable)){
          func.variables.push(variable); //add varibale info to the popped function
        }
        parentChildStack.push(func); //push the function back on the stack
      }
        /**
		 * IMPLEMENT THIS FOR OUR ANALYSIS == ANAM DODHY
         * This callback is called before the execution of a function body starts.
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {function} f - The function object whose body is about to get executed
         * @param {*} dis - The value of the <tt>this</tt> variable in the function body
         * @param {Array} args - List of the arguments with which the function is called
         * @returns {undefined} - Any return value is ignored
         */
        this.functionEnter = function (iid, f, dis, args) {
             var functionAttributes = {
               name: "",
               variables:  []
             };

            if (parentChildStack.length <= 1){
              //var functionAttributes= {};
              functionAttributes.name = f.name;
              parentChildStack.push(functionAttributes);
            }
            else{
              //checkHoistability(parentChildStack)
              //parentChildStack.shift(); no need to shift as we need to keep track of the parentFunctions
              functionAttributes.name = f.name;
              parentChildStack.push(functionAttributes);
            }
        };

        /**
		 * IMPLEMENT THIS FOR OUR ANALYSIS == ANAM DODHY
         * This callback is called when the execution of a function body completes
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {*} returnVal - The value returned by the function
         * @param {{exception:*} | undefined} wrappedExceptionVal - If this parameter is an object, the function
         * execution has thrown an uncaught exception and the exception is being stored in the <tt>exception</tt>
         * property of the parameter
         * @returns {{returnVal: *, wrappedExceptionVal: *, isBacktrack: boolean}}  If an object is returned, then the
         * actual <tt>returnVal</tt> and <tt>wrappedExceptionVal.exception</tt> are replaced with that from the
         * returned object. If an object is returned and the property <tt>isBacktrack</tt> is set, then the control-flow
         * returns to the beginning of the function body instead of returning to the caller.  The property
         * <tt>isBacktrack</tt> can be set to <tt>true</tt> to repeatedly execute the function body as in MultiSE
         * symbolic execution.
         */
        this.functionExit = function (iid, returnVal, wrappedExceptionVal) {
             if (parentChildStack.length == 1){
               parentChildStack.pop();
             }
             else if (parentChildStack.length >= 2){
               //console.log ("+++++++++++++++++++++++++++++++++++++++++")
               //console.log ("-------ORG STACK---")
               //console.log (parentChildStack)
               var poppedFunction = parentChildStack.pop();
               checkFunctionHoistability(poppedFunction)
             }

            return {returnVal: returnVal, wrappedExceptionVal: wrappedExceptionVal, isBacktrack: false};
        };

        function checkFunctionHoistability(poppedFunction){
          var parent = parentChildStack.pop();
          var found = false;
          //console.log ("-------Parent--" + parent.name + "---")
          //console.log (parent.variables)
          //console.log ("-------Child--" + poppedFunction.name + "---")
          //console.log (poppedFunction.variables)
          for (var i=0; i < parent.variables.length; i++) {
            for (var j =0; j < poppedFunction.variables.length; j++){
              if (parent.variables[i].name === poppedFunction.variables[j].name) {
                  console.log (poppedFunction.name + "--- can not be hoisted");
                  found = true
                  //push the parent back on top of the stack
                  break;
              }
            }
            if (found == true){
              break;
            }
          }
          parentChildStack.push(parent);
          if (found == false){
            console.log (poppedFunction.name + "--- can be hoisted. GREAT!!");
          }

        }
    }

    sandbox.analysis = new MyAnalysis();
})(J$);
