var Foo = {
    init: function (who) {
        this.me = who;
    },
    identify: function () {
        return 'I am ' + this.me;
    }
}

var Bar = Object.create(Foo);

Bar.speak = function () {
    alert('Hello' + this.identify() + ' ');
}

var b1 = Object.create(Bar);
b1.init('b1');
b1.speak();