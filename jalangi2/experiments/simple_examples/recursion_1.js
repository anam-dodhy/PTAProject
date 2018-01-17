function calculateCountDown(val){
    function simplyNest(value){
        function countdown(a) {
            if (a > 0) {
                //console.log(a);
                return countdown(a - 1);
            } else {
            return a;
            }
        }
        return countdown (value);
    }
    return simplyNest(val);
}
res = calculateCountDown(3);
console.log(res);