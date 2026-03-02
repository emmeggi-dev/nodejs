// 02_ispeziona_chiave.js
// Legge ed ispeziona una chiave pubblica

const openpgp = require('openpgp');
const fs = require('fs');

async function ispezioneChiave() {
  // Legge la chiave pubblica dal file
  const armoredKey = fs.readFileSync('chiave_pubblica.asc', 'utf8');
  const chiave = await openpgp.readKey({ armoredKey });

  // Legge le informazioni
  const userID = chiave.getUserIDs()[0];
  const fingerprint = chiave.getFingerprint().toUpperCase();
  const keyID = chiave.getKeyID().toHex().toUpperCase();
  const creazione = chiave.getCreationTime();
  const scadenza = await chiave.getExpirationTime();
  const algoritmo = chiave.getAlgorithmInfo();

  console.log('=== Informazioni Chiave Pubblica ===\n');
  console.log(`👤 Utente:      ${userID}`);
  console.log(`🔑 Key ID:      ${keyID}`);
  console.log(`🖊️  Fingerprint: ${fingerprint}`);
  console.log(`📅 Creata:      ${creazione.toLocaleDateString('it-IT')}`);

  const scadenzaStr = (scadenza instanceof Date) 
      ? scadenza.toLocaleDateString('it-IT') 
      : 'Nessuna';

  console.log(`⏳ Scadenza:     ${scadenzaStr}`);
  console.log(`🧮 Algoritmo:   ${algoritmo.algorithm} (${algoritmo.bits || algoritmo.curve || ''} bit)`);
}

ispezioneChiave().catch(console.error);
