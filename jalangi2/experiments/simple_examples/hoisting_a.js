// Hoisted
// Analysis doesnt log any ouput in console

function checkHoistability() {
  console.log('Hoisted!')
}

checkHoistability();

/*module.exports = {
    checkHoistability: checkHoistability
}*/
