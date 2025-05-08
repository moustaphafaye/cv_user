// fichier: tokenBlacklist.js
const blacklist = new Set();

function addToBlacklist(token) {
  blacklist.add(token);
  // Supprimer le token après expiration (ex: 1h)
  setTimeout(() => blacklist.delete(token), 3600 * 1000); // 1h
}

function isBlacklisted(token) {
  return blacklist.has(token);
}

module.exports = { addToBlacklist, isBlacklisted };
