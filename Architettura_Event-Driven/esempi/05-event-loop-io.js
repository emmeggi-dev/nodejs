const fs = require('fs');

console.log('Inizio', __filename);

// Lettura file (operazione I/O asincrona)
fs.readFile(__filename, () => {
    console.log('File letto');
    
    setTimeout(() => console.log('setTimeout in I/O'), 0);
    
    setImmediate(() => console.log('setImmediate in I/O'));
});

setTimeout(() => {
    console.log('setTimeout fuori I/O');
}, 0);

setImmediate(() => {
    console.log('setImmediate fuori I/O');
});

console.log('Fine');
