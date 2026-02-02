let hoFinito = () => console.log("Lavoro completato!");
let nonRiesco = () => console.log("Non sono capace!");

let array = [
    hoFinito,
    nonRiesco
];

for (funzione of array) {
    funzione();
}
