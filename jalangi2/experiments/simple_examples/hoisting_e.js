// code doesn't work
// extra bracket surrounding function converts it into a function expression

(function checkHoistability() {
  console.log('Hoisted!')
})

checkHoistability()

module.exports = {
    checkHoistability: checkHoistability
}
