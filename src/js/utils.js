import Peer from "peerjs";

/**
 * @returns {Peer}
 */
export function wordBowlPeer() {
  const signalingServerConfig = {
    host: "peerjs-server.toteto.tech",
    port: 9443,
    secure: true
  };

  return new Peer({
    ...signalingServerConfig,
    config: {
      iceServers: [
        {
          url: "turn:numb.viagenie.ca",
          username: "antonioivanovski@gmail.com",
          credential: "LfeuhHqbto8JM+JwMYDbdjWdV"
        }
      ]
    },
    debug: 2
  });
}

/**
 * @typedef {string} UUID
 */

/**
 * @returns {UUID} - The generated {@link UUID}
 */
export function uuid() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
}

Array.prototype.elementAfter = function(from) {
  const fromIndex = this.findIndex(e => e === from);
  if (fromIndex > -1 && fromIndex < this.length) {
    return this[fromIndex + 1];
  } else {
    return null;
  }
};

Array.prototype.sample = function() {
  return this[Math.floor(Math.random() * this.length)];
};

export default { uuid, wordBowlPeer };
