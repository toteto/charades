import Peer from "peerjs";

const urlSearchParams = new URLSearchParams(new URL(window.location.href).search);

/**
 * @returns {Peer}
 */
export function wordBowlPeer() {
  let signalingServerConfig = null;
  signalingServerConfig = {
    host: "peerjs-server.toteto.tech",
    key: "d122cb81-885f-43a3-9bb3-43fd8a111bc1",
    secure: true
  };
  if (urlSearchParams.has("key")) {
  }

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
