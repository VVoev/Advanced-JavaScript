// function foo() {
//     var bar = "bar";

//     function baz() {
//         console.log(bar);//lexical
//     }

//     baz();
// }

// foo();




/* Cheating */
var bar = "bar";
function foo(str) {
    eval(str);//cheating
    console.log(bar);//42
}

foo("var bar=42;");

var obj = {
    a: 2,
    b: 3,
    c: 4
};

obj.a = obj.b + obj.c;
obj.c = obj.b - obj.a;

with (obj) { //disable many of the integrated optimizisations and its now existing in "strict mode"
    a = b + c;
    d = b - a;
    d = 3;//??
}

obj.d;
d;