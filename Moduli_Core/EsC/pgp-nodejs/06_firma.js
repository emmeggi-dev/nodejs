// 06_firma.js
// Firma un messaggio in chiaro: il testo rimane leggibile, la firma è allegata

const openpgp = require('openpgp');
const fs = require('fs');

async function firmaMessaggio(testo, privateKeyFile, passphrase) {
  console.log('✍️  Firma messaggio...\n');

  // Carica e decifra la chiave privata
  const armoredKey = fs.readFileSync(privateKeyFile, 'utf8');
  const encryptedPrivateKey = await openpgp.readPrivateKey({ armoredKey });
  const privateKey = await openpgp.decryptKey({
    privateKey: encryptedPrivateKey,
    passphrase,
  });

  // Crea il messaggio cleartext (testo leggibile)
  const unsignedMessage = await openpgp.createCleartextMessage({ text: testo });

  // Firma il messaggio
  const signed = await openpgp.sign({
    message: unsignedMessage,
    signingKeys: privateKey,
  });

  // Salva
  fs.writeFileSync('comunicato_firmato.asc', signed);

  console.log('✅ Messaggio firmato salvato in: comunicato_firmato.asc\n');
  console.log(signed);
}

firmaMessaggio(
  'Comunicato ufficiale: la verifica si terrà il 10 marzo 2026.\nProf. Filippo Bilardo',
  'chiave_privata.asc',
  'SuperSegreto123!'
).catch(console.error);
