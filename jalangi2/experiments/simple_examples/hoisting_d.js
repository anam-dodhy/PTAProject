// Code does not work

checkHoistability()

var checkHoistability = function() {
  console.log('Hoisted!')
}

module.exports = {
    checkHoistability: checkHoistability
}
