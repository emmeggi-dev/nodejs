const crypto = require('crypto');

/**
 * Genera hash SHA-256 di una password
 * @param {string} password - Password da hashare
 * @returns {string} Hash in formato esadecimale (64 caratteri)
 */
function hashPassword(password) {
  // Crea hasher SHA-256
  const hash = crypto.createHash('sha256');
  
  // Aggiungi la password da hashare
  hash.update(password);
  
  // Ottieni hash in formato esadecimale
  return hash.digest('hex');
}

// === TEST ===

console.log('=== Test Hash Password ===\n');

// Test 1: Stessa password produce stesso hash
const password1 = 'mySecretPassword123';
const password2 = 'mySecretPassword123';

const hash1 = hashPassword(password1);
const hash2 = hashPassword(password2);

console.log('Test 1: Determinismo');
console.log('Password 1:', password1);
console.log('Hash 1:    ', hash1);
console.log('Password 2:', password2);
console.log('Hash 2:    ', hash2);
console.log('✓ Hashes uguali?', hash1 === hash2 ? '✅ SI' : '❌ NO');
console.log();

// Test 2: Password diversa produce hash diverso
const password3 = 'differentPassword';
const hash3 = hashPassword(password3);

console.log('Test 2: Password Diverse');
console.log('Password 3:', password3);
console.log('Hash 3:    ', hash3);
console.log('✓ Hash diverso?', hash1 !== hash3 ? '✅ SI' : '❌ NO');
console.log();

// Test 3: Avalanche effect (piccolo cambio → grande differenza)
const password4 = 'mySecretPassword124';  // Solo ultimo carattere diverso
const hash4 = hashPassword(password4);

console.log('Test 3: Avalanche Effect');
console.log('Password 1:', password1);
console.log('Hash 1:    ', hash1);
console.log('Password 4:', password4, '(solo un carattere diverso)');
console.log('Hash 4:    ', hash4);
console.log('✓ Hash completamente diverso?', hash1 !== hash4 ? '✅ SI' : '❌ NO');
