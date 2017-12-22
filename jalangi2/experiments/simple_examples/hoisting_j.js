// Hoisted
// Analysis doesnt log any ouput on console

var checkHoistability = (function() {
  console.log('Hoisted!')
})

checkHoistability()

module.exports = {
    checkHoistability: checkHoistability
}
