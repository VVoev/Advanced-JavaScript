var foo = (function () {

    var o = { bar: 'bar' }

    return {
        bar: function () {
            console.log(o.bar);
        }
    }

})();

foo.bar();

var container = (() => {

    var publicAPI = {
        control: function () {
            publicAPI.decrement();
        },
        decrement: function () {
            console.log('You are about to decrement a number')
        }
    };

    return publicAPI;
})();

container.control();