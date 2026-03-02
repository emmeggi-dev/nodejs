// 09_decifra_da_gpg.js
// Decifra con Node.js un messaggio cifrato dalla CLI di GPG

const openpgp = require('openpgp');
const fs = require('fs');

async function main() {
  const armoredMessage = fs.readFileSync('risposta_gpg.asc', 'utf8');
  const message = await openpgp.readMessage({ armoredMessage });

  const encPrivKey = await openpgp.readPrivateKey({
    armoredKey: fs.readFileSync('chiave_privata.asc', 'utf8'),
  });
  const privateKey = await openpgp.decryptKey({
    privateKey: encPrivKey,
    passphrase: 'SuperSegreto123!',
  });

  const { data } = await openpgp.decrypt({
    message,
    decryptionKeys: privateKey,
  });

  console.log('✅ Decifrato da Node.js:', data);
}

main().catch(console.error);
