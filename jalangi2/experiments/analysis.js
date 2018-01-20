(function (sandbox) {
    var branches = {};

    function MyAnalysis() {

        var roots = [];
        //var printed = false;
        var currentNode = null;
        //var exceptionAlreadyThrown = false;


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
            console.log("Added variable to: ", this.name, variable.name, variable.isArgument)
        };        

        function checkValidityOfVariable(_name, _val, _isArgument, _argumentIndex){
            //console.log ("------------checkValidityOfVariable-----------------------");
            //console.log("name: "+_name+" isArgument: "+_isArgument+" argumentIndex: "+_argumentIndex)
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
                var parentVars = getVariableNames(this.variables);
                console.log("ChildVars: "+childVars+" ParentVars: "+parentVars)
                childVars.forEach(function(childVar){
                    console.log("child var "+childVar)
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
            if(this.parent) {
                var siblings = getChildNamesFromNode(this.parent); // Might have to remove this as it could also be part of siblings
                var children = getChildNamesFromNode(this);
                siblings.forEach(function(sibling){
                    if(children.indexOf(sibling)>-1) isHoistable = false; 
                })
            } else {
                console.log('No Parent node present');
            }
            return isHoistable;
        }

        function checkHoistability(node){
            var isHoistableWithParent = false;
            var isHoistableWithParentSiblings = false;
            isHoistableWithParentSiblings = node.compareHoistabilityWithSiblings();
            console.log("isHoistableWithParentSiblings? ",isHoistableWithParentSiblings);
            isHoistableWithParent = node.compareHoistabilityWithParent();
            console.log("isHoistableWithParent? ",isHoistableWithParent);
        }

        this.declare = function (iid, name, val, isArgument, argumentIndex, isCatchParam) {
            //console.log ("------------declare-----------------------");
            //console.log("name: "+name+" isArgument: "+isArgument)
            if(!checkValidityOfVariable(name, val, isArgument, argumentIndex ) && (currentNode)){
                currentNode.addVariable(name, isArgument);
            }
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
                if(currentNode){
                    if (currentNode != null && currentNode.parent != null) {
                        console.log("in if")
                        currentNode = currentNode.parent;
                    }
                    checkHoistability(currentNode);
                return {result: val};
                }
            }
        }

        // can be used to check if a function is constructor or method
        this.invokeFunPre = function (iid, f, base, args, isConstructor, isMethod, functionIid, functionSid) {
            
        };

        TreeNode.prototype.addChild = function (child) {
            console.log(" ADDING CHILD " + child.name  + " to PARENT " + this.name)
            child.parent = this; // newNode.parent = currentNode
            this.children.push(child); // currentNode.children.push(newNode)
            
        };

        this.functionEnter = function (iid, f, dis, args) {
            console.log("\nTHIS FUNCTION CALLED FOR: " + f.name)
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
                console.log(
                    "current node : " + currentNode.name +
                    //"\ncurrent node parent: " + currentNode.name +
                    "\ncurrent node child: " + currentNode.children[currentNode.children.length - 1].name
                )
                currentNode = newNode;
            }
        };

        this.functionExit = function (iid, returnVal, wrappedExceptionVal) {
            console.log("----------on function exit-------------");
            console.log("Return value: ", returnVal);
        };
    }

    sandbox.analysis = new MyAnalysis();
}(J$));


/*var parentVars = getVariableNames(this.variables); // [a,b]
            this.children.forEach(function(child){
                console.log(child.name);
                var childVars = getVariableNames(child.variables); // [b, c]
                childVars.forEach(function(childVar){
                    if(parentVars.indexOf(childVar)>-1) isHoistable = false; 
                })
            })

            return isHoistable;
            */
 /*TreeNode.prototype.addVariableToNode = function (_name, _isArgument) {
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
        };*/

//add a new root node
            /*let parentName = "NO_PARENT"
            if(currentNode.parent){
                parentName = currentNode.parent.name
            }
            console.log(
                "current node : " + currentNode.name +
                "\ncurrent node parent: " + parentName +
                "\ncurrent node child: " + JSON.stringify(currentNode.children)
            )*/
/*this.read = function (iid, name, val, isGlobal, isScriptLocal) {
            //console.log ("------------after variable read-----------------------");
            //console.log("name: "+name+" val: "+val+" iid: "+iid+" isGlobal: "+isGlobal+" isScriptLocal: "+isScriptLocal)
            return {result: val};
        };

        ;*/