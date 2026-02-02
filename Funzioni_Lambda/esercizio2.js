let hoFinito = () => console.log("Lavoro completato!");
let nonRiesco = () => console.log("Non sono capace!");

let pippo = (callback) => {
  for (let i = 1; i <= 10; i++) {
    console.log(i);
  }
  callback();
};

console.log("Di seguito l'esecuzione con callback hoFinito");
pippo(hoFinito);

console.log("Di seguito l'esecuzione con callback nonRiesco");
pippo(nonRiesco);
