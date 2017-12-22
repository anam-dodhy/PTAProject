//code does not work

var x = (function checkHoistability() {
  console.log('Hoisted!')
})

x() // works
checkHoistability() // does not work

module.exports = {
    checkHoistability: checkHoistability
}
