/*onReady(cb)
/Users/ksen/Dropbox/jalangi2/src/js/runtime/analysisCallbackTemplate.js, line 632
onReady is useful if your analysis is running on node.js (i.e., via the direct.js or jalangi.js commands) and needs to complete some asynchronous initialization before the instrumented program starts. In such a case, once the initialization is complete, invoke the cb function to start execution of the instrumented program. Note that this callback is not useful in the browser, as Jalangi has no control over when the instrumented program runs there.
Name	Type	Description
cb*/

(function (sandbox) {

    var util = require('util');
    function MyAnalysis() {

        var roots = [];
        var currentNode = null;
        /**
         * Class of Tree to store the hierarchy of nested functions
         * @param data function to save
         * @param parent
         * @param iid
         */
        function TreeNode(data, parent) {
            this.data = data;
            this.parent = parent;
            this.children = [];
            this.variables = [];
            this.funcBody = null;
            this.name = null;
            this.isHoistableWithParent = false;
            this.nonHoistableParents = [];
            if (data.name) {
                this.name = data.name;
            } else {
                this.name = "anonymous"; // in case of function expressions which have no function name
            }
        }

        /**
         * add function variables to a node which is representing a single function
         * @param _name name of the variable
         * @param _isArgument
         */
        TreeNode.prototype.addVariable = function (_name, _isArgument, _type) {
            var variable = {
                name: _name,
                isArgument: _isArgument,
                type: _type
            }
            var variableAlreadyExists = false;
            this.variables.forEach(function(v) {
                if ((v.name == variable.name) && (variable.type != "declared")){
                    if ((v.type == "declared") || (v.type == variable.type)){
                        variableAlreadyExists = true;
                    }
                }
            });
            if (!variableAlreadyExists){
              this.variables.push(variable);
              console.log("Added variable " +variable.name+" to: "+ this.name+" argument "+ variable.isArgument+" type "+ variable.type)
            }
        };

        /**
         * function checks whether the child function node is dependent on any of the parent function node variables there by checking
         one of the conditions of hoistability
         */
        TreeNode.prototype.compareHoistabilityWithParent = function() {
            var isHoistable = true;
            if(this.parent) {
                console.log("In if comparehoistability")
                var childVars = getVariableNames(this.variables, true); // [a,b]
                var parentVars = getVariableNames(this.parent.variables, false);
                console.log("ChildVars: "+childVars+" ParentVars: "+parentVars)
                childVars.forEach(function(childVar){
                    if(parentVars.indexOf(childVar)>-1) isHoistable = false;
                })
            } else {
                console.log("node has no parents");
            }
            return isHoistable;
        }

        /**
         * function that adds a child to a node
         * @param child
         */
        TreeNode.prototype.addChild = function (child) {
            //console.log(" ADDING CHILD " + child.name  + " to PARENT " + this.name)
            // Check if this and child are same. Then it is a recursive call. Don't add child
            if((this.funcBody===child.funcBody && this.name.localeCompare(child.name) == 0) && this.name != "anonymous" && child.name != "anonymous"){
              // if the function name is anonymous then it is part of un-named function expression and we need to add that to our stack
               console.log(child.name + " is a recursive function")
            } else {
                child.parent = this; // newNode.parent = currentNode
                this.children.push(child); // currentNode.children.push(newNode)
            }
        };
        /**
         * function checks the vailidty of a given variable by making sure that its not a function
         * @param _name name of the variable
         * @param _val
         */
        function checkValidityOfVariable(_name, _val){
          try{
            if (_val != undefined){
                if(_val.toString().indexOf("function") > -1 || _name.toString().indexOf("arguments") > -1){ // if the function is being declared then we need to ignore it
                    //function expression here
                    return true;
                } else {
                    return false;
                }
            }
          }
          catch(err){

          }

        }

        /**
         * function gets the list of variable names from an array of variables
         * @param variableObjects array of variables
         */
        function getVariableNames(variableObjects, isChild) {
            var variableNames = [];
            variableObjects.forEach(function(variable) {
                if (isChild && variable.isDeclared){
                    console.log("ignore child declared variables")
                }
                else{
                    variableNames.push(variable.name)
                }
            });
            return variableNames;
        }

        /**
         * function returns the list of names of all the children of a given node
         * @param node
         */
        function getChildNamesFromNode(node) {
            var names = [];
            if(node.children && node.children.length > 0) {
                node.children.forEach(function(child) {
                    names.push(child.name)
                });
            }
            return names;
        }

        /**
         * function checks the hoistability flags of a given node and logs a string with the result
         * @param node
         */
        function printNodeResult(node){
          result = "";
          if (node.isHoistableWithParent == true){
            result = node.name + " under "+ node.parent.name + " is hoistable GREAT!! ";
            if (node.nonHoistableParents.length > 0){
              result = result + "BUT not under ";
              node.nonHoistableParents.forEach(function (nonHoistableParent){
                result = result + nonHoistableParent + ", ";
              });
            }

          }
          else{
            result = node.name + " under "+  node.parent.name +" is NOT hoistable";
          }
          console.log(result)
        }

        /**
         * function loops through the whole tree and checks the hoistability of each node with its parent's siblings and above
         * @param node
         */
        function checkHoistabilityWithParentSiblings(node){
          if(node.children && node.children.length > 0) {
              node.children.forEach(function(child) {
                  if (child.parent.parent && child.isHoistableWithParent == true){
                    checkHoistabilityOfNode(child, child.parent.parent)
                  }
                  printNodeResult(child)
                  checkHoistabilityWithParentSiblings(child)
              });
          }
          else{
            return;
          }
        }

        /**
         * function checks whether there is another function with the same definition defined anywhere in the hierarchy above the given function node
         * @param nodeToCheck
         * @param node
         */
        function checkHoistabilityOfNode(nodeToCheck, node){
          if (node){
            node.children.forEach(function (child){
              if (nodeToCheck.name == child.name){
                nodeToCheck.nonHoistableParents.push(node.name)
                return
              }
            });
            checkHoistabilityOfNode(nodeToCheck, node.parent)
          }
        }

        /**
         * function checks whether a node is dependent on it's parent by using any of the parent variables
         * @param node
         */

        function checkHoistabilityWithParent(node){
            node.isHoistableWithParent = false;
            node.isHoistableWithParent = node.compareHoistabilityWithParent();
            console.log(node.name +  " isHoistableWithParent? ",node.isHoistableWithParent);
        }

        this.declare = function (iid, name, val, isArgument, argumentIndex, isCatchParam) {
            //console.log("----declare---")
                     //console.log(val)
            //if (val != undefined && val != null){
                console.log("----declare-xxxxxxxxxx---")
                console.log(val)
                //console.log("----xxxxxxxxxx---")
             //}

            if(!checkValidityOfVariable(name, val ) && (currentNode)){
             //console.log("----declare---")
             //console.log(val)
              currentNode.addVariable(name, isArgument, "declared");
            }
            return {result: val};
        };

        this.read = function (iid, name, val, isGlobal, isScriptLocal) {
        //console.log("----read---")
                   //console.log(val)
             /*if (val != undefined && val != null){
                 console.log("----read-xxxxxxxxxx---")
                 console.log(val)
                 console.log("----xxxxxxxxxx---")
              }*/
            if(!checkValidityOfVariable(name, val ) && (currentNode)){
            //console.log("----read---")
            //console.log(val)
                currentNode.addVariable(name, false, "read");
            }
            return {result: val};
          };

        this.write = function (iid, name, val, lhs, isGlobal, isScriptLocal) {
        //console.log("----read---")
                                //console.log(val)
           /* if (val != undefined && val != {}){
                console.log("----write-xxxxxxxxxx---")
                console.log(val)
                console.log("----xxxxxxxxxx---")
             }*/

            if(val === eval) {
                console.log("Indirect eval detected!!!",name, val );
            }
            else if(!checkValidityOfVariable(name, val ) && (currentNode)){
            //console.log("----read---")
                        //console.log(val)
                  currentNode.addVariable(name, false, "written");
            }
            return {result: val};
        }

        // can be used to check if a function is constructor or method
        this.invokeFunPre = function (iid, f, base, args, isConstructor, isMethod, functionIid, functionSid) {

        };

        this.functionEnter = function (iid, f, dis, args) {
            var curName = "NOPARENT";
            if(currentNode) curName = currentNode.name;

            console.log("\nTHIS FUNCTION CALLED FOR: " + f.name + " and the currentNode is " + curName)
            var newNode = null;
            newNode = new TreeNode(f, currentNode, false);
            console.log("\nTHIS FUNCTION CALLED FOR: " + newNode.name + " and the currentNode is " + curName)

            if (currentNode === null) {
                currentNode = newNode;
                roots.push(newNode); //add root node
                console.log(currentNode.name+" is not nested"); //may be hoistable
            } else {
                //currentNode is not null so add as child to currentNode
                currentNode.addChild(newNode);
                console.log("Switching currentNode from " + currentNode.name + " to " + newNode.name)
                currentNode = newNode;
            }
        };

        this.functionExit = function (iid, returnVal, wrappedExceptionVal) {
            console.log("----------on function exit-------------");
            console.log("Current node : "+currentNode.name)

            checkHoistabilityWithParent(currentNode);
            if (currentNode != null && currentNode.parent != null) {
                currentNode = currentNode.parent; //move back to the current node's parent
                console.log("Current node on exit: "+currentNode.name)
                console.log("\n");
            }else if (currentNode.parent == null){ //the whole tree is built and currentNode is the rootNode
              console.log("\n")
              console.log("+++++RESULT+++++")
              checkHoistabilityWithParentSiblings(currentNode)
            }
        };
    }

    sandbox.analysis = new MyAnalysis();
}(J$));
