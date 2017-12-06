//node ../src/js/commands/jalangi.js --inlineIID --inlineSource --analysis analysis2.js mainExample.js
(function (sandbox) {

  var functionAttributes = {
    name: "",
    isParent: false,
    variables: [{
      name: "",
      isArgument: ""
    }]
  }

  var parentChildStack = []
  childCount = 0;

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
            //console.log ("declare---name-" + name + "---isArgument-"+isArgument + "---val--"+ val )
            //console.log ("------------declare-----------------------")
            if (val!=undefined && val.toString().indexOf("function") > -1){ // if the function is being declared then we need to ignore it
                // do nothing
            }
            else{
              /*if (parentFunction.children.length > 0){ //loop through the parent variables and check if child has any of them
                console.log (parentFunction.isPresent)
                var variable = {name: name, isArgument: isArgument};
                parentFunction.children[childCount-1].variables.push(variable);
                //console.log ("declare---name-" + name + "---isArgument-"+isArgument );
              }
              else{ // push all parent variables
                var variable = {name: name, isArgument: isArgument};
                parentFunction.variables.push(variable);
              }*/
            }
            //console.log ("");
            return {result: val};
        };

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
			       console.log ("-------functionEnter--")
             /*console.log ("---args--")
             console.log (args)
             console.log ("---f--")
             console.log (f.name)*/

            if (parentChildStack.length <= 1){
              var functionAttributes= {};
              functionAttributes.name = f.name;
              parentChildStack.push(functionAttributes);
            }
            else{
              //checkHoistability(parentChildStack)
              parentChildStack.shift();
              var functionAttributes = {};
              functionAttributes.name = f.name;
              parentChildStack.push(functionAttributes);
            }

            console.log (parentChildStack)
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
             console.log ("functionExit....");
             if (parentChildStack.length == 1){
               parentChildStack.pop();
             }
             else if (parentChildStack.length < 3){
               //checkHoistability(parentChildStack)
               parentChildStack.pop();
             }
            //console.log (parentChildStack)
            return {returnVal: returnVal, wrappedExceptionVal: wrappedExceptionVal, isBacktrack: false};
        };

    }

    sandbox.analysis = new MyAnalysis();
})(J$);
