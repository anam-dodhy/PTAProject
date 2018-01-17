function calculateCountDown(val){
    function simplyNest(val){ //not hoistable
        function countdown(a) { //hoistable
            if (a > 0) {
                return countdown(a - 1);
            } else {
            return a;
            }
        }
        return countdown (val);
    }
    return simplyNest(val);
}

module.exports = {
    calculateCountDown: calculateCountDown
}