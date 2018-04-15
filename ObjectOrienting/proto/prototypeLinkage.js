function Foo(who) {
    this.me = who;
}

Foo.prototype.identify = function () {
    return "I am " + this.me;
}

var a1 = new Foo('a1');
a1.identify(); //I am a1

a1.identify = function () { // Shadowing
    alert('Helloo, ' + Foo.prototype.identify.call(this));
}

a1.identify(); //Hello i am a1