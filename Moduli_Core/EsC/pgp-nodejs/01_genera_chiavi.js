// 01_genera_chiavi.js
// Genera una coppia di chiavi ECC Curve25519 con OpenPGP.js

const openpgp = require('openpgp');
const fs = require('fs');

async function generaChiavi() {
  console.log('⏳ Generazione chiavi in corso...\n');

  // Genera la coppia di chiavi
  const { privateKey, publicKey, revocationCertificate } = await openpgp.generateKey({
    type: 'ecc',              // 'ecc' (Curve25519) oppure 'rsa' con rsaBits: 4096
    curve: 'curve25519',      // curva ellittica
    userIDs: [{ name: 'Mario Rossi', email: 'mario.rossi@scuola.it' }],
    passphrase: 'SuperSegreto123!',  // protegge la chiave privata
    format: 'armored',        // output ASCII armored (-----BEGIN PGP...)
  });

  // Salva le chiavi su file
  fs.writeFileSync('chiave_pubblica.asc', publicKey);
  fs.writeFileSync('chiave_privata.asc', privateKey);
  fs.writeFileSync('certificato_revoca.asc', revocationCertificate);

  console.log('✅ Chiavi generate e salvate:\n');
  console.log('📄 chiave_pubblica.asc');
  console.log('🔒 chiave_privata.asc');
  console.log('⚠️  certificato_revoca.asc\n');
  console.log('--- Chiave Pubblica (prime righe) ---');
  console.log(publicKey.slice(0, 200) + '...\n');
}

generaChiavi().catch(console.error);
