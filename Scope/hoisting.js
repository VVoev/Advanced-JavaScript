a;                  //                                  var a;
b;                  //                                  var b;
var a = b;       //=>during the commplile phase         a;
var b = 2;           //                                 b;
b;                  //                                  a=b;
a;                  //                                  b=2;
//                                  b;
//                                  a;
foo();

var foo = 2;

function foo() {
    console.log('bar');
}

function foo() {
    console.log('foo');
}

a(1);
function a(foo) {
    if (foo > 20) return foo;
    return b(foo + 2);
}

function b(foo) {
    return c(foo) + 1;
}

function c(foo) {
    return a(foo * 2)
}

