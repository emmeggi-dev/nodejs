console.log('1 - Inizio');

setTimeout(() => {
    console.log('2 - setTimeout');
}, 0);

setImmediate(() => {
    console.log('3 - setImmediate');
});

process.nextTick(() => {
    console.log('4 - process.nextTick');
});

console.log('5 - Fine');
