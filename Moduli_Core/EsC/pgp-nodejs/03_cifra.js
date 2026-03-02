// 03_cifra.js
// Cifra un messaggio con la chiave pubblica del destinatario

const openpgp = require('openpgp');
const fs = require('fs');

async function cifraMessaggio(testoInChiaro, recipientKeyFile) {
  console.log('🔐 Cifratura messaggio...\n');
  console.log('Testo originale:', testoInChiaro);

  // Carica la chiave pubblica del destinatario
  const armoredKey = fs.readFileSync(recipientKeyFile, 'utf8');
  const recipientKey = await openpgp.readKey({ armoredKey });

  // Crea l'oggetto messaggio
  const message = await openpgp.createMessage({ text: testoInChiaro });

  // Cifra il messaggio
  const encrypted = await openpgp.encrypt({
    message,
    encryptionKeys: recipientKey,   // chiave pubblica destinatario
  });

  // Salva su file
  fs.writeFileSync('messaggio_cifrato.asc', encrypted);

  console.log('\n✅ Messaggio cifrato salvato in: messaggio_cifrato.asc');
  console.log('\n--- Contenuto cifrato (prime righe) ---');
  console.log(encrypted.slice(0, 180) + '...\n');

  return encrypted;
}

// Cifra un messaggio di esempio
const testo = 'Ciao Mario! Questo messaggio è riservato. La password del server è: Tigre@2026';
cifraMessaggio(testo, 'chiave_pubblica.asc').catch(console.error);
