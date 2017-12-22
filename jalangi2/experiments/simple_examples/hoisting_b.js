//Hoisted

//Ananlysis tells Cant be hoisted

checkHoistability()

function checkHoistability() {
  var name = 'Hoisted'; // name is a local variable created by init
  function displayName() { // displayName() is the inner function, a closure
    console.log(name); // use variable declared in the parent function
  }
  displayName();
  //console.log('Hoisted!')
}

module.exports = {
    checkHoistability: checkHoistability
}
