// 08_cifra_e_firma.js
// Cifra per il destinatario E firma con la propria chiave privata

const openpgp = require('openpgp');
const fs = require('fs');

async function cifraEFirma(testo, recipientKeyFile, senderPrivKeyFile, passphrase) {
  // Carica la chiave pubblica del destinatario
  const recipientKey = await openpgp.readKey({
    armoredKey: fs.readFileSync(recipientKeyFile, 'utf8'),
  });

  // Carica la chiave privata del mittente
  const encPrivKey = await openpgp.readPrivateKey({
    armoredKey: fs.readFileSync(senderPrivKeyFile, 'utf8'),
  });
  const senderKey = await openpgp.decryptKey({
    privateKey: encPrivKey,
    passphrase,
  });

  // Crea il messaggio
  const message = await openpgp.createMessage({ text: testo });

  // Cifra (chiave pubblica destinatario) + Firma (chiave privata mittente)
  const encrypted = await openpgp.encrypt({
    message,
    encryptionKeys: recipientKey,   // solo il destinatario può leggere
    signingKeys: senderKey,         // garantisce che il mittente è autentico
  });

  fs.writeFileSync('msg_cifrato_firmato.asc', encrypted);
  console.log('✅ Messaggio cifrato e firmato salvato in: msg_cifrato_firmato.asc');
  console.log('   Solo il destinatario può leggerlo, e sa che viene da te.');
}

cifraEFirma(
  'Messaggio riservato: le credenziali sono nell\'allegato.',
  'chiave_pubblica.asc',   // in un caso reale: chiave del destinatario
  'chiave_privata.asc',
  'SuperSegreto123!'
).catch(console.error);
