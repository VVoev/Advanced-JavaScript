var definition = 'Close is when a function Remembers its lexical scope even whenthe function is executed outside that lexical scope';



function foo() {

    var bar = 'bar';

    setTimeout(function () {
        console.log(bar);
    }, 1000)
}

foo();

function counter() {

    var bar = 0;

    setTimeout(function () {
        console.log(bar++);
    }, 100)

    setTimeout(function () {
        console.log(bar++);
    }, 200)
}

counter();

for (var index = 0; index <= 5; index++) {
    setTimeout(function () {
        console.log(`i:${index}`)       // 6 times I=6
    }, 1000);
}

for (var i = 0; i <= 5; i++) {
    (function (i) {
        setTimeout(function () {
            console.log(`i:${i}`)       // 0,1,2,3,4,5
        }, 1000);
    })(i);
}