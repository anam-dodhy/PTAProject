// Hoisted
// Analysis doesnt log any ouput on console

var checkHoistability = (function() {
  console.log('Hoisted!')
})()

module.exports = {
    checkHoistability: checkHoistability
}
