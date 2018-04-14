for (let index = 0; index < 5; index++) {

    setTimeout(function () {
        console.log(`I:${index}`);
    }, index * 1000)
}