function functionParent(a) {
  var b=1;
 function functionChild() {
	return a + 1;
 }
 return functionChild();
}
functionParent("test");
