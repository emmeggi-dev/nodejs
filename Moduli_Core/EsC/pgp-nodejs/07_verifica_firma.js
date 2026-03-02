// 07_verifica_firma.js
// Verifica l'autenticità e l'integrità di un messaggio firmato

const openpgp = require('openpgp');
const fs = require('fs');

async function verificaFirma(signedFile, publicKeyFile) {
  console.log('🔍 Verifica firma in corso...\n');

  // Leggi il messaggio firmato
  const armoredMessage = fs.readFileSync(signedFile, 'utf8');
  const signedMessage = await openpgp.readCleartextMessage({ cleartextMessage: armoredMessage });

  // Carica la chiave pubblica del firmatario
  const armoredKey = fs.readFileSync(publicKeyFile, 'utf8');
  const verificationKey = await openpgp.readKey({ armoredKey });

  // Verifica la firma
  const verificationResult = await openpgp.verify({
    message: signedMessage,
    verificationKeys: verificationKey,
  });

  const { verified, keyID } = verificationResult.signatures[0];

  try {
    await verified; // Lancia eccezione se la firma non è valida
    console.log('✅ FIRMA VALIDA');
    console.log(`   Key ID del firmatario: ${keyID.toHex().toUpperCase()}`);
    console.log(`\n--- Testo del messaggio ---`);
    console.log(verificationResult.data);
  } catch (error) {
    console.log('❌ FIRMA NON VALIDA:', error.message);
  }
}

verificaFirma('comunicato_firmato.asc', 'chiave_pubblica.asc').catch(console.error);
