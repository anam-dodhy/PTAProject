//code doesn't work

checkHoistability()

var x = function checkHoistability() {
  console.log('Hoisted!')
}

module.exports = {
    checkHoistability: checkHoistability
}
