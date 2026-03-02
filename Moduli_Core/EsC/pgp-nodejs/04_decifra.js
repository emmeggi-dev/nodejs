// 04_decifra.js
// Decifra un messaggio con la propria chiave privata

const openpgp = require('openpgp');
const fs = require('fs');

async function decifraMessaggio(encryptedFile, privateKeyFile, passphrase) {
  console.log('🔓 Decifratura messaggio...\n');

  // Leggi il messaggio cifrato
  const armoredMessage = fs.readFileSync(encryptedFile, 'utf8');
  const message = await openpgp.readMessage({ armoredMessage });

  // Carica la chiave privata
  const armoredKey = fs.readFileSync(privateKeyFile, 'utf8');
  const encryptedPrivateKey = await openpgp.readPrivateKey({ armoredKey });

  // Decifra la chiave privata con la passphrase
  const privateKey = await openpgp.decryptKey({
    privateKey: encryptedPrivateKey,
    passphrase,
  });

  // Decifra il messaggio
  const { data: decrypted, signatures } = await openpgp.decrypt({
    message,
    decryptionKeys: privateKey,
  });

  console.log('✅ Messaggio decifrato con successo!\n');
  console.log('--- Contenuto ---');
  console.log(decrypted);
  console.log('\n--- Info firma ---');
  if (signatures.length > 0) {
    console.log(`Firme presenti: ${signatures.length}`);
  } else {
    console.log('ℹ️  Messaggio non firmato');
  }
}

// Decifra con la propria chiave privata
decifraMessaggio(
  'messaggio_cifrato.asc',
  'chiave_privata.asc',
  'SuperSegreto123!'           // passphrase impostata al momento della generazione
).catch(console.error);
