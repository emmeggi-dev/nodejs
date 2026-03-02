// server/keystore.js
// Simula un registro di chiavi pubbliche degli utenti (in produzione: database)

const openpgp = require('openpgp');

// Mappa email → chiave pubblica armorata
const store = new Map();

async function registraUtente(email, armoredPublicKey) {
  // Valida la chiave prima di salvarla
  const key = await openpgp.readKey({ armoredKey: armoredPublicKey });
  store.set(email, { armoredPublicKey, fingerprint: key.getFingerprint() });
  console.log(`✅ Registrato: ${email} (fp: ${key.getFingerprint().slice(0, 16)}...)`);
}

async function getChiave(email) {
  const entry = store.get(email);
  if (!entry) return null;
  return openpgp.readKey({ armoredKey: entry.armoredPublicKey });
}

function listaUtenti() {
  return [...store.entries()].map(([email, data]) => ({
    email,
    fingerprint: data.fingerprint,
  }));
}

module.exports = { registraUtente, getChiave, listaUtenti };
