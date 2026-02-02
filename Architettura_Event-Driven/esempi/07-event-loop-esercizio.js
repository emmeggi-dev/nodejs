console.log('Start');

setTimeout(() => {
    console.log('Timer 1');
    Promise.resolve().then(() => console.log('Promise in Timer 1'));
    process.nextTick(() => console.log('NextTick in Timer 1'));
}, 0);

Promise.resolve()
    .then(() => {
        console.log('Promise 1');
        process.nextTick(() => console.log('NextTick in Promise 1'));
        return Promise.resolve();
    })
    .then(() => {
        console.log('Promise 2');
        setTimeout(() => console.log('Timer in Promise 2'), 0);
        process.nextTick(() => console.log('NextTick in Promise 2'));
    });

process.nextTick(() => {
    console.log('NextTick 1');
    Promise.resolve().then(() => console.log('Promise in NextTick 1'));
});

setImmediate(() => {
    console.log('Immediate 1');
    Promise.resolve().then(() => console.log('Promise in Immediate 1'));
    process.nextTick(() => console.log('NextTick in Immediate 1'));
});

setTimeout(() => {
    console.log('Timer 2');
    setImmediate(() => console.log('Immediate in Timer 2'));
}, 0);

process.nextTick(() => {
    console.log('NextTick 2');
});

console.log('End');
