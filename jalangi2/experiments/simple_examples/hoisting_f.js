//code doesn't work
//extra bracket surrounding function converts it into a function expression

checkHoistability()

(function checkHoistability() {
  console.log('Hoisted!')
})

module.exports = {
    checkHoistability: checkHoistability
}
