let addizione = (a,b) => a + b;
let sottrazione = (a,b) => a - b;
let moltiplicazione = (a,b) => a * b;
let divisione = (a,b) => a / b;

let array = [
    addizione,
    sottrazione,
    moltiplicazione,
    divisione
];

for (operazione of array) {
    console.log(operazione(10,2));
}
