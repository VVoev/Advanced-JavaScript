var foo = 'bar';

function bar() {
    var foo = 'baz';
}

function baz(foo) {
    var foo = "bam";
    bam = "yay"; // fucking bam will be attached on a global scope because its non declared
}