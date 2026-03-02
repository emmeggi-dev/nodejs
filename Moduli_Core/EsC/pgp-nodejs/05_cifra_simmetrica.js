// 05_cifra_simmetrica.js
// Cifra con una passphrase condivisa (senza coppie di chiavi)

const openpgp = require('openpgp');
const fs = require('fs');

async function cifraSimmetrica(testo, passphrase) {
  const message = await openpgp.createMessage({ text: testo });

  const encrypted = await openpgp.encrypt({
    message,
    passwords: [passphrase],     // usa una passphrase invece delle chiavi asimmetriche
    config: { preferredSymmetricAlgorithm: openpgp.enums.symmetric.aes256 },
  });

  fs.writeFileSync('nota_cifrata_sym.asc', encrypted);
  console.log('✅ File cifrato con passphrase: nota_cifrata_sym.asc');
}

async function decifraSimmetrica(file, passphrase) {
  const armoredMessage = fs.readFileSync(file, 'utf8');
  const message = await openpgp.readMessage({ armoredMessage });

  const { data } = await openpgp.decrypt({
    message,
    passwords: [passphrase],
  });

  console.log('✅ Decifrato:', data);
}

(async () => {
  await cifraSimmetrica('Note riservate: appuntamento alle 15:00', 'passwordCondivisa42!');
  await decifraSimmetrica('nota_cifrata_sym.asc', 'passwordCondivisa42!');
})().catch(console.error);
