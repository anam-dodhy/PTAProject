var foo = "bar";

function bar() {
    var foo = "baz";

    function baz(foo) {
    	foo = "bam";
    	bam = "yay"; // Heard of LHS reference for a variable named bam ? The baz and bar scope  not. Even the global scope has not heard. Therefore the global scope automatically registers a variable named bam
    }
    baz();
}

bar();
foo; 		// "bar" RHS reference for a variable named foo, The global scope has because foo was declared on line 1 in the compilation phase
bam; 		// "yay" RHS reference for a variable named bam, The global scope has because bar was automatically created two steps back
//baz(); 	// Error! RHS reference for a variable named baz ? The global scope has not because baz was exists in the function scope of bar. Therefore, baz is inaccessible to the global scope and a reference error is thrown.
