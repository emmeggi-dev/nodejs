console.log('Inizio');

setTimeout(() => {
    console.log('setTimeout 1');
    Promise.resolve().then(() => console.log('Promise in setTimeout 1'));
}, 0);

Promise.resolve()
    .then(() => {
        console.log('Promise 1');
        setTimeout(() => console.log('setTimeout in Promise 1'), 0);
    })
    .then(() => {
        console.log('Promise 2');
    });

setImmediate(() => {
    console.log('setImmediate 1');
});

process.nextTick(() => {
    console.log('nextTick 1');
    process.nextTick(() => console.log('nextTick 2'));
});

setTimeout(() => {
    console.log('setTimeout 2');
}, 0);

console.log('Fine');
