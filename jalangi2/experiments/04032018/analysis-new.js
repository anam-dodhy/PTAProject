/*onReady(cb)
/Users/ksen/Dropbox/jalangi2/src/js/runtime/analysisCallbackTemplate.js, line 632
onReady is useful if your analysis is running on node.js (i.e., via the direct.js or jalangi.js commands) and needs to complete some asynchronous initialization before the instrumented program starts. In such a case, once the initialization is complete, invoke the cb function to start execution of the instrumented program. Note that this callback is not useful in the browser, as Jalangi has no control over when the instrumented program runs there.
Name	Type	Description
cb*/

(function (sandbox) {

    var util = require('util');
    function MyAnalysis() {

        var roots = [];
        var rootNode = {};
        var currentNode = null;
        /**
         * Class of Tree to store the hierarchy of nested functions
         * @param data function to save
         * @param parent
         * @param iid
         */
        function TreeNode(data, parent, iid, nodeName) {
            this.iid = iid;
            //this.data = data;
            this.parent = parent;
            this.children = [];
            this.variables = [];
            this.funcBody = null;
            this.name = null;
            this.isHoistableWithParent = false;
            this.nonHoistableParents=[];
            if (nodeName){
                this.name = nodeName;
            }
            else{
                if (data.name) {
                    this.name = data.name;
                } else {
                    this.name = "anonymous"; // in case of function expressions which have no function name
                }
            }
        }

        /**
         * add function variables to a node which is representing a single function
         * @param _name name of the variable
         * @param _isArgument
         */
        TreeNode.prototype.addVariable = function (_name, _isArgument) {
            var variable = {
                name: _name,
                isArgument: _isArgument
            }
            var variableAlreadyExists = false;
            this.variables.forEach(function(v) {
                if (v.name == variable.name){
                  variableAlreadyExists = true;
                }
            });
            if (!variableAlreadyExists){
              this.variables.push(variable);
              //console.log("Added variable " +variable.name+" to: "+ this.name+" argument "+ variable.isArgument)
            }
        };

        /**
         * function checks whether the child function node is dependent on any of the parent function node variables there by checking
         one of the conditions of hoistability
         */
        TreeNode.prototype.compareHoistabilityWithParent = function() {
            var isHoistable = true;
            if(this.parent) {
                //console.log("In if comparehoistability")
                var childVars = getVariableNames(this.variables); // [a,b]
                var parentVars = getVariableNames(this.parent.variables);
                //console.log("ChildVars: "+childVars+" ParentVars: "+parentVars)
                childVars.forEach(function(childVar){
                    if(parentVars.indexOf(childVar)>-1) isHoistable = false;
                })
            } else {
                //console.log("node has no parents");
            }
            return isHoistable;
        }

        /**
         * function that adds a child to a node
         * @param child
         */
        TreeNode.prototype.addChild = function (child) {
            //console.log(" ADDING CHILD " + child.name  + " to PARENT " + this.name)
            if (this.parent){
                //console.log("GRAND_PARENT " + this.parent.name)
            }
            // Check if this and child are same. Then it is a recursive call. Don't add child
            if((this.funcBody===child.funcBody && this.name.localeCompare(child.name) == 0) && this.name != "anonymous" && child.name != "anonymous"){
              // if the function name is anonymous then it is part of un-named function expression and we need to add that to our stack
               console.log(this.name + " " + child.name + " is a recursive function")
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
        function checkValidityOfVariable(_name, _val, iid){
          try{
            if (_val != undefined){
                if(_val.toString().indexOf("function") > -1 ){ // if the function is being declared then we need to ignore it
                    var childExists = false;
                    var newNode = null;
                    newNode = new TreeNode(_val, currentNode, iid, _val["Function"]);
                    currentNode.children.forEach(function(child) {
                        if (child.name == newNode.name){
                            childExists = true
                        }
                    });
                    if (!childExists){
                        currentNode.addChild(newNode);
                    }
                    return true;
                }
                else if (_name.toString().indexOf("arguments") > -1 || _name.toString().indexOf("console") > -1 ){
                    return true;
                }
                else {
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
        function getVariableNames(variableObjects) {
            var variableNames = [];
            variableObjects.forEach(function(variable) {
                variableNames.push(variable.name)
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
            if (node.parent){
                result = node.name + " at line::"+ node.iid +" under "+ node.parent.name + " is hoistable GREAT!! ";
                if(node.nonHoistableParents.length > 0){
                    result = result + "BUT not under ";
                     node.nonHoistableParents.forEach(function (parent){
                        result = result + parent + " at Line::"+ parent.iid +", iid";
                      });
                }
            }
            else{
            //incase of root node
                result = node.name + " is root so does not need hoisting";
                return;
            }
          }
          else{
            result = node.name + " at line::"+ node.iid +" under "+  node.parent.name +" is NOT hoistable (isHoistableWithParent: " + node.isHoistableWithParent + " nonHoistableParents: "+  node.nonHoistableParents + ")";
          }
          console.log(result)
        }

        function checkHoistabilityWithParentSiblings(node, parent){
          if (node.isHoistableWithParent == true){
            //console.log(node.name)
            //console.log(node.children.length)
            var isHoistableParent = true;
            parent.children.forEach(function (child){
             if (child.name == node.name){
             //if parent contains any child with the same name then set isHoistableParent to false
               node.nonHoistableParents.push(parent.name);
               //isHoistableParent = false;
               return;
             }
            });
            if (parent.parent){
                checkHoistabilityWithParentSiblings(node, parent.parent)
            }
            else{
            //when there are no more parents left to check
                return;
            }

          }
        }

        /**
         * function checks whether there is another function with the same definition defined anywhere in the hierarchy above the given function node
         * @param nodeToCheck
         * @param node
         */
        function checkHoistabilityOfNode(nodeToCheck, grandParent){
          if (grandParent){
            grandParent.children.forEach(function (child){
              if (nodeToCheck.name == child.name){
                nodeToCheck.nonHoistableParents.push(child.name)
                return
              }
            });
          }
        }

        /**
         * function checks whether a node is dependent on it's parent by using any of the parent variables
         * @param node
         */

        function checkHoistabilityWithParent(node){
            node.isHoistableWithParent = false;
            node.isHoistableWithParent = node.compareHoistabilityWithParent();
            //console.log(node.name +  " isHoistableWithParent? ",node.isHoistableWithParent);
        }

        this.declare = function (iid, name, val, isArgument, argumentIndex, isCatchParam) {
            if(!checkValidityOfVariable(name, val, iid ) && (currentNode)){
                currentNode.addVariable(name, isArgument);
            }
            return {result: val};
        };

        this.read = function (iid, name, val, isGlobal, isScriptLocal) {
            if(!checkValidityOfVariable(name, val, iid ) && (currentNode)){
                currentNode.addVariable(name, false);
            }
            return {result: val};
          };

        this.write = function (iid, name, val, lhs, isGlobal, isScriptLocal) {
            if(val === eval) {
                console.log("Indirect eval detected!!!",name, val );
            }
            else if(!checkValidityOfVariable(name, val, iid ) && (currentNode)){
                  currentNode.addVariable(name, false);
            }
            return {result: val};
        }

        // can be used to check if a function is constructor or method
        this.invokeFun = function (iid, f, base, args, isConstructor, isMethod, functionIid) {
        };

        this.functionEnter = function (iid, f, dis, args) {
            var curName = "NOPARENT";
            if(currentNode) curName = currentNode.name;

            var newNode = null;
            newNode = new TreeNode(f, currentNode, iid);
            //console.log("\nTHIS FUNCTION CALLED FOR: " + newNode.name + " and the currentNode is " + curName)

            if (currentNode === null) {
                rootNode = newNode;
                roots.push(newNode); //add root node
                //console.log(currentNode.name+" is not nested"); //may be hoistable
            }
            //console.log("Switching currentNode from " + currentNode.name + " to " + newNode.name)
            currentNode = newNode;
        };

        this.functionExit = function (iid, returnVal, wrappedExceptionVal) {
            //console.log("----------on function exit-------------");
            //console.log("Current node : "+currentNode.name)

            checkHoistabilityWithParent(currentNode); //check Rule1 of hoistability for currentNode
            if (currentNode.parent){ // if parent exists then check for Rule2 of hoistability for currentNode
                if (currentNode.parent.parent){
                    checkHoistabilityWithParentSiblings(currentNode, currentNode.parent.parent);
                }
            }
            printNodeResult(currentNode)

            if (currentNode != null && currentNode.parent != null) {
                currentNode = currentNode.parent; //move back to the current node's parent
            }
        };

        function printNodeHierarchy(node){
            console.log("Current node on exit: "+node.name+ " has " + node.children.length + " children")
            if (node.parent){
                console.log("PARENT: "+node.parent.name + " has " + node.parent.children.length + " children")
                if (currentNode.parent.parent){
                    console.log("GRANDPARENT: "+node.parent.parent.name + " has " + node.parent.parent.children.length + " children")
                }
            }
             console.log("\n");
        }
    }

    sandbox.analysis = new MyAnalysis();
}(J$));
