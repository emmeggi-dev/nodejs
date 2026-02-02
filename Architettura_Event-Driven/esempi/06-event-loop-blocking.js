setTimeout(() => {
    console.log('setTimeout - Dovrei eseguirmi dopo 100ms');
    console.log('Ma sono stato ritardato dal codice bloccante!');
}, 100);

// Simuliamo un'operazione pesante che blocca l'event loop
console.log('Inizio operazione bloccante...');
const start = Date.now();
while (Date.now() - start < 3000) {
    // Blocchiamo per 3 secondi
    // In un'app reale, questo potrebbe essere un calcolo pesante
}
console.log('Fine operazione bloccante (3 secondi dopo)');

console.log('Fine');
