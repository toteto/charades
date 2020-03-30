/**
 * @typedef {Object} HostControllerState
 * @property {!boolean} inProgress - Wether the game is started, or is still waiting for players to join.
 * @property {!Player[]} players - List of all connected players to the host.
 * @property {?CurrentTurn} currentTurn - State for the current turn the game is at.
 */

/**
 * @typedef {Object} Player
 * @property {string} name - The name of the player
 * @property {number} score - The score the player has scored
 * @property {PlayerWord[]} words - The words the player has added into the game
 * @property conn - The PeerJs connection used to communicate with the player.
 */

/**
 * @typedef {Object} CurrentTurn
 * @property {UUID} turnId
 * @property {Player} player
 * @property {PlayerWord} word
 */

/**
 * @typedef {Object} PlayerWord
 * @property {string} value - The string value of the word, the one the player inserted.
 * @property {boolean} guessed - Wether the word has been guessed or not
 */
