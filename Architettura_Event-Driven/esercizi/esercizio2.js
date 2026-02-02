const EventEmitter = require('events');

class Semaforo extends EventEmitter {
  constructor() {
    super();
    this.stato = 'rosso';
  }
  
  cambiaColore(nuovoColore) {
    switch (nuovoColore) {
        case "rosso","giallo","verde": break;
        default: return;
    }
    
    const vecchioStato = this.stato;
    this.stato = nuovoColore;
    
    // Emissione evento del cambio colore
    this.emit("cambio-colore", { vecchioStato: vecchioStato, nuovoStato: this.stato });
    
    // Emissione eventi "rosso", "giallo" e "verde"
    this.emit(this.stato);
  }
  
  avviaSequenza() {
    // Definizione della sequenza
    let sequenza = ["verde", "giallo", "rosso"];
    let indice = 0;

    // Ogni 3000 ms ...
    setInterval(() => {
      // ... camia colore ...
      this.cambiaColore(sequenza[indice]);
      // ... incrementa l'indice ...
      indice++;
      // ... ed evita di superare il limite dell'array
      if (indice >= sequenza.length) indice = 0;
    }, 3000);
  }
}

// Creazione istanza del semaforo
const semaforo = new Semaforo();

// Listener per ogni cambio colore
semaforo.on("cambio-colore", (info) => {
  console.log("Cambio colore da " + info.vecchioStato + " a " + info.nuovoStato);
});

// Listener specifico per "rosso" che avvisa "STOP!"
semaforo.on("rosso", () => {
  console.log("STOP!");
});

// Listener che conta i cambi
let contaCambi = 0;
semaforo.on("cambio-colore", () => {
  contaCambi++;
  console.log("Colore cambiato " + contaCambi + " volte");
});

// Listener con once solo per il primo cambio
semaforo.once('cambio-colore', () => {
  console.log("Primo cambio!");
});

// Avvia la sequenza automatica
semaforo.avviaSequenza();
