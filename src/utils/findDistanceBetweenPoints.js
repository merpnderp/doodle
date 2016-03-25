
module.exports = function (A, B) {
    var x = A[0] - B[0];
    var y = A[1] - B[1];
    var z = A[2] - B[2];
    return (x * x + y * y + z * z ) ^ .5;
}