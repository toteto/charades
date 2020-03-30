import * as util from "./utils";

export default class ClientController {
  static create(userData) {
    const peer = util.wordBowlPeer();
    return new ClientController(userData, peer);
  }

  _peer = null;
  _userData = null;

  constructor(userData, peer) {
    this._peer = peer;
    this._userData = userData;
  }

  /**
   * @param gameId The ID of the game to join.
   * @returns {Promise<void>}
   */
  joinGame(gameId) {
    return new Promise((resolve, reject) => {
      const { name, words } = this._userData;
      const conn = this._peer.connect(gameId, {
        metadata: { name, words },
        serialization: "json",
        reliable: true
      });

      const timeoutId = setTimeout(() => {
        conn.close();
        reject();
      }, 10000);

      conn.on("open", () => {
        clearTimeout(timeoutId);
        this._registerForGameStateUpdates(conn);
        resolve();
      });
    });
  }

  _onPlayersReceiver = null;
  /**
   * @param {({name: string, score: number}[]) => void} callback
   */
  onPlayersReceived(receiver) {
    this._onPlayersReceiver = receiver;
  }

  _onCurrentTurnReceiver = null;
  /**
   *
   * @param {({player: string, word: string, correct: () => Promise<void>, incorrect: () => Promise<void>}) => void} receiver
   */
  onCurrentTurnReceived(receiver) {
    this._onCurrentTurnReceiver = receiver;
  }

  _onNoCurrentTurnReceiver = null;
  /**
   * @param {() => void} receiver
   */
  onNoCurrentTurnAvailable(receiver) {
    this._onNoCurrentTurnReceiver = receiver;
  }

  _registerForGameStateUpdates(conn) {
    conn.on("data", gameState => {
      console.log(gameState);

      this._onPlayersReceiver?.(gameState.players);

      const currentTurn = gameState.currentTurn;
      if (currentTurn) {
        this._onCurrentTurnReceiver?.({
          player: currentTurn.player,
          word: currentTurn.word,
          correct: () => this._guess(conn, currentTurn, true),
          incorrect: () => this._guess(conn, currentTurn, false)
        });
      } else {
        this._onNoCurrentTurnReceiver?.();
      }
    });
  }

  /**
   * @returns {Promise<void>}
   */
  _guess(conn, currentTurn, correctGuess) {
    return new Promise((resolve, _) => {
      resolve(conn.send({ id: currentTurn.turnId, correct: correctGuess }));
    });
  }
}
