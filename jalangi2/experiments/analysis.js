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
         * Tree class for saving callstack
         * @param data function to save
         * @param parent
         * @param iid
         */
        function TreeNode(data, parent, iid) {
            this.data = data;
            this.iid = iid;
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
                this.name = "anonymous";
            }
        }

        TreeNode.prototype.traverseDF = function () {
            function recurse(currentNode) {
                for (var i = 0; i < currentNode.children.length; i++) {
                    recurse(currentNode.children[i]);
                }
            }
            recurse(this);
        };

        /**
         * Finds tree node in callstack hierarchy using DepthFirst search
         * @param data function to find
         * @returns {*}
         */
        TreeNode.prototype.findNode = function (data) {
            function recurse(currentNode) {

                if (currentNode.data === data || currentNode.funcBody === data) {
                    return currentNode;
                } else {
                    var i;
                    var result = null;
                    for (i = 0; result == null && i < currentNode.children.length; i++) {
                        result = recurse(currentNode.children[i]);
                    }
                    return result;
                }
            }
            return recurse(this);
        };

        /**
         * Prints whole hierarchy of `tempPrintNode`
         * @param tempPrintNode
         */
        function printStackTrace(tempPrintNode) {
            while (tempPrintNode != null) {
                var lineNo = J$.iidToLocation(J$.sid, tempPrintNode.iid).split(":")[3];
                //var name = tempPrintNode.name == "F" ? "anonymous" : tempPrintNode.name;
                name = tempPrintNode.name;
                console.log("function:" + name + " OffsetNo:" + lineNo);
                tempPrintNode = tempPrintNode.parent;
            }
        }

        TreeNode.prototype.addVariable = function (_name, _isArgument) {
            //console.log(_isArgument)
            var variable = {
                name: _name,
                isArgument: _isArgument
            }
            this.variables.push(variable);
            console.log("Added variable " +variable.name+" to: "+ this.name+" argument "+ variable.isArgument)
        };

        function checkValidityOfVariable(_name, _val){
            //console.log ("------------checkValidityOfVariable-----------------------");
            //console.log("name: "+_name)
            if (_val != undefined){
                if(_val.toString().indexOf("function") > -1 || _name.toString().indexOf("arguments") > -1){ // if the function is being declared then we need to ignore it
                    return true;
                } else {
                    return false;
                }
            }

        }
        function getVariableNames(variableObjects) {
            var variableNames = [];
            variableObjects.forEach(function(variable) {
                variableNames.push(variable.name)
            });
            return variableNames;
        }

        // check if the Child function is dependent on the local variables or arguments of parent
        // in this case the Child function is not hoistable
        TreeNode.prototype.compareHoistabilityWithParent = function() {
            var isHoistable = true;
            if(this.parent) {
                console.log("In if comparehoistability")
                var childVars = getVariableNames(this.variables); // [a,b]
                var parentVars = getVariableNames(this.parent.variables);
                console.log("ChildVars: "+childVars+" ParentVars: "+parentVars)
                childVars.forEach(function(childVar){
                    if(parentVars.indexOf(childVar)>-1) isHoistable = false;
                })
            } else {
                console.log("node has no parents");
            }
            return isHoistable;
        }

        function getChildNamesFromNode(node) {
            var names = [];
            if(node.children && node.children.length > 0) {
                node.children.forEach(function(child) {
                    names.push(child.name)
                });
            }
            return names;
        }

        TreeNode.prototype.compareHoistabilityWithSiblings = function() {
            var isHoistable = true;
            if(this.parent && this.parent.parent) {
                var parentsSiblings = getChildNamesFromNode(this.parent.parent); // Might have to remove this as it could also be part of siblings
                var siblings = getChildNamesFromNode(this.parent);
                console.log("siblings: "+siblings+" parentsSiblings: "+parentsSiblings)
                siblings.forEach(function(sibling){
                    if(parentsSiblings.indexOf(sibling)>-1) isHoistable = false;
                })
            } else {
                console.log('No Grandparent node present');
            }
            return isHoistable;
        }

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

        function checkHoistabilityWithParentSiblings(node){
          if(node.children && node.children.length > 0) {
              node.children.forEach(function(child) {
                  if (child.parent.parent && child.isHoistableWithParent == true){ //only check
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

        function checkHoistabilityWithParent(node){
            node.isHoistableWithParent = false;
            //var isHoistableWithParentSiblings = false;
            //isHoistableWithParentSiblings = node.compareHoistabilityWithSiblings();
            //console.log("isHoistableWithParentSiblings? ",isHoistableWithParentSiblings);
            node.isHoistableWithParent = node.compareHoistabilityWithParent();
            console.log("isHoistableWithParent? ",node.isHoistableWithParent);
        }

        this.declare = function (iid, name, val, isArgument, argumentIndex, isCatchParam) {
            //console.log ("------------declare-----------------------");
            //console.log("name: "+name+" isArgument: "+isArgument)
            if(!checkValidityOfVariable(name, val ) && (currentNode)){
                currentNode.addVariable(name, isArgument);
            }
            return {result: val};
        };

        this.read = function (iid, name, val, isGlobal, isScriptLocal) {
            //console.log ("------------after variable read-----------------------");
            return {result: val};
          };

        this.write = function (iid, name, val, lhs, isGlobal, isScriptLocal) {
            //console.log ("------------before variable write-----------------------");
            //console.log("name: "+name+" val: "+val+" iid: "+iid+" isGlobal: "+isGlobal+" isScriptLocal: "+isScriptLocal+" lhs: "+lhs)
            if(val === eval) {
                console.log("Indirect eval detected!!!",name, val );
                return {result: val};
            }
            else{
                return {result: val};
            }
        }

        // can be used to check if a function is constructor or method
        this.invokeFunPre = function (iid, f, base, args, isConstructor, isMethod, functionIid, functionSid) {

        };

        TreeNode.prototype.addChild = function (child) {
            console.log(" ADDING CHILD " + child.name  + " to PARENT " + this.name)
            // Check if this and child are same. Then it is a recursive call. Don't add child
            //console.log("this: ", util.inspect(this))
            //console.log("child: ", util.inspect(child))
            if(this.funcBody===child.funcBody && this.name.localeCompare(child.name) == 0){
                console.log(child.name + " is a recursive function")
            } else {
                child.parent = this; // newNode.parent = currentNode
                this.children.push(child); // currentNode.children.push(newNode)
            }
        };

        this.functionEnter = function (iid, f, dis, args) {
            var curName = "NOPARENT";
            if(currentNode) curName = currentNode.name;
            console.log("\nTHIS FUNCTION CALLED FOR: " + f.name + " and the currentNode is " + curName)
            var newNode = null;
            newNode = new TreeNode(f, currentNode, false, iid);
            //console.log("new node", newNode.name)

            if (currentNode === null) {
                currentNode = newNode;
                roots.push(newNode);
                console.log(currentNode.name+" is not nested"); //may be hoistable
            } else {
                //currentNode is not null so add as child to currentNode
                currentNode.addChild(newNode);
                console.log("Switching currentNode from" + currentNode.name + " to " + newNode.name)
                currentNode = newNode;


            }
        };

        this.functionExit = function (iid, returnVal, wrappedExceptionVal) {
            console.log("----------on function exit-------------");
            console.log("Current node : "+currentNode.name)
            checkHoistabilityWithParent(currentNode);
            if (currentNode != null && currentNode.parent != null) {
                currentNode = currentNode.parent;
            }else if (currentNode.parent == null){ //the whole tree is built and currentNode is the rootNode
              console.log("\n")
              console.log("+++++RESULT+++++")
              checkHoistabilityWithParentSiblings(currentNode)
            }
            console.log("Current node on exit: "+currentNode.name)
            console.log("\n");

        };
    }

    sandbox.analysis = new MyAnalysis();
}(J$));
