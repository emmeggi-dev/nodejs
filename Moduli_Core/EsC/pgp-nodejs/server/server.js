// server/server.js
// Mini-server REST con endpoint per cifratura/decifratura PGP

const express = require('express');
const openpgp = require('openpgp');
const fs = require('fs');
const path = require('path');
const keystore = require('./keystore');

const app = express();
app.use(express.json());

// ─────────────────────────────────────────────
// POST /api/keys  — registra una chiave pubblica
// Body: { "email": "...", "publicKey": "-----BEGIN PGP..." }
// ─────────────────────────────────────────────
app.post('/api/keys', async (req, res) => {
  const { email, publicKey } = req.body;
  if (!email || !publicKey) {
    return res.status(400).json({ error: 'email e publicKey sono richiesti' });
  }
  try {
    await keystore.registraUtente(email, publicKey);
    res.json({ success: true, message: `Chiave registrata per ${email}` });
  } catch (err) {
    res.status(400).json({ error: 'Chiave non valida: ' + err.message });
  }
});

// ─────────────────────────────────────────────
// GET /api/keys  — lista delle chiavi registrate
// ─────────────────────────────────────────────
app.get('/api/keys', (req, res) => {
  res.json({ utenti: keystore.listaUtenti() });
});

// ─────────────────────────────────────────────
// POST /api/encrypt  — cifra un messaggio per un utente registrato
// Body: { "recipient": "email@...", "message": "testo" }
// ─────────────────────────────────────────────
app.post('/api/encrypt', async (req, res) => {
  const { recipient, message: testo } = req.body;
  if (!recipient || !testo) {
    return res.status(400).json({ error: 'recipient e message sono richiesti' });
  }

  const recipientKey = await keystore.getChiave(recipient);
  if (!recipientKey) {
    return res.status(404).json({ error: `Nessuna chiave trovata per ${recipient}` });
  }

  const message = await openpgp.createMessage({ text: testo });
  const encrypted = await openpgp.encrypt({
    message,
    encryptionKeys: recipientKey,
  });

  res.json({ encrypted });
});

// ─────────────────────────────────────────────
// POST /api/decrypt  — decifra un messaggio
// Body: { "encryptedMessage": "...", "passphrase": "..." }
// ─────────────────────────────────────────────
app.post('/api/decrypt', async (req, res) => {
  const { encryptedMessage, passphrase } = req.body;
  if (!encryptedMessage || !passphrase) {
    return res.status(400).json({ error: 'encryptedMessage e passphrase sono richiesti' });
  }

  try {
    // Carica la chiave privata del server (in produzione non esporla mai!)
    const armoredKey = fs.readFileSync(
      path.join(__dirname, '..', 'chiave_privata.asc'), 'utf8'
    );
    const encPrivKey = await openpgp.readPrivateKey({ armoredKey });
    const privateKey = await openpgp.decryptKey({ privateKey: encPrivKey, passphrase });

    const message = await openpgp.readMessage({ armoredMessage: encryptedMessage });
    const { data } = await openpgp.decrypt({ message, decryptionKeys: privateKey });

    res.json({ decrypted: data });
  } catch (err) {
    res.status(400).json({ error: 'Decifratura fallita: ' + err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server in ascolto su http://localhost:${PORT}\n`);
  console.log('Endpoints disponibili:');
  console.log('  POST /api/keys    — registra chiave pubblica');
  console.log('  GET  /api/keys    — lista chiavi registrate');
  console.log('  POST /api/encrypt — cifra messaggio');
  console.log('  POST /api/decrypt — decifra messaggio');
});
