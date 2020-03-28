import * as util from "./utils";
export default class WordBowlHostController {
  static create() {
    const peer = util.wordBowlPeer();
    return new WordBowlHostController(peer);
  }

  _peer = null;

  /**
   * The mutable state of the host.
   * @type {HostControllerState}
   * @private
   * @readonly
   */
  _hostState = {
    get inProgress() {
      return this.currentTurn != null;
    },
    players: []
  };

  constructor(peer) {
    this._peer = peer;
    this._registerForIncomingGameJoins();
  }

  /**
   * @returns {Promise<string>} the hosted game ID
   */
  gameId() {
    return new Promise((resolve, _) => {
      if (this._peer.id) {
        resolve(wordBowlPeer.id);
      } else {
        this._peer.on("open", id => {
          resolve(id);
        });
      }
    });
  }

  /**
   * @returns {Promise<void>} resolved when game is started.
   */
  startGame() {
    //TODO: Make command that comes via Peer
    //TODO: Make player member of team in order to have the correct order.
    return new Promise((resolve, _) => {
      this._updateStateForNextTurn();
      this._sendPublicStateToPlayers();
      resolve();
    });
  }

  _onRoundFinishedReceiver = null;
  /**
   * @param {(() => Promise<void>)) => void} receiver
   */
  onRoundFinished(receiver) {
    this._onRoundFinishedReceiver = receiver;
  }

  _registerForIncomingGameJoins() {
    this._peer.on("connection", conn => {
      conn.on("open", () => {
        let player = this._hostState.players.find(p => p.name === conn.metadata.name);
        if (player) {
          player.conn.close();
          player.conn = conn;
        } else {
          player = {
            name: conn.metadata.name,
            words: conn.metadata.words.map(w => ({ value: w, guessed: false })),
            score: 0,
            conn: conn
          };
          this._hostState.players.push(player);
        }
        console.log(`Player '${player.name}' has joined.`);

        this._registerForPlayerDisconnect(player);
        this._registerForPlayerActions(player);
        this._sendPublicStateToPlayers();
      });
    });
  }

  /** @param {Player} player */
  _registerForPlayerDisconnect(player) {
    // TODO: not sure if needed, may be useless error handling.
    // Should be checked with WebRTC protocol.
    player.conn.on("close", () => {
      player.conn.close();
      console.warn(`${player.name} has disconnected`);
      if (this._hostState.inProgress) {
        Promise.resolve(
          this._peer.connect(player.conn.peer, {
            serialization: "json",
            reliable: true
          })
        ).then(newConn => {
          console.log(`Reconnecting with ${player.name}.`);
          console.log(`${player.name} has reconnected.`);
          player.conn = newConn;
          this._registerForPlayerDisconnect(player);
          this._registerForPlayerActions(player);
          newConn.on("open", () => {
            this._sendPublicStateToPlayers();
          });
        });
      } else {
        player.conn.close();
        const playerIndex = this._hostState.players.indexOf(player);
        if (playerIndex > -1) {
          this._hostState.players.splice(playerIndex, 1);
          this._sendPublicStateToPlayers();
        }
      }
    });
  }

  /** @param {Player} player */
  _registerForPlayerActions(player) {
    player.conn.on("data", guessAction => {
      const currentTurn = this._hostState.currentTurn;
      if (guessAction.id === currentTurn?.turnId) {
        currentTurn.player.score += guessAction.correct ? 1 : 0;
        currentTurn.word.guessed = guessAction.correct;

        this._updateStateForNextTurn();
        this._sendPublicStateToPlayers();
      }
    });
  }

  _updateStateForNextTurn() {
    debugger;
    const remainingWords = this._hostState.players.flatMap(p => p.words.filter(w => !w.guessed));
    if (remainingWords.length > 0) {
      this._hostState.currentTurn = {
        turnId: util.uuid(),
        player:
          this._hostState.players.elementAfter(this._hostState.currentTurn?.player) ??
          this._hostState.players[0],
        word: remainingWords.sample()
      };
    } else {
      this._hostState.currentTurn = null;
      this._onRoundFinishedReceiver?.(() => {
        return new Promise((resolve, _) => {
          this._hostState.players.forEach(p => p.words.forEach(w => (w.guessed = false)));
          this._updateStateForNextTurn();
          this._sendPublicStateToPlayers();
          resolve();
        });
      });
    }
  }

  _sendPublicStateToPlayers() {
    const mutualPlayerState = {
      players: this._hostState.players.map(p => ({ name: p.name, score: p.score }))
    };

    debugger;
    const currentTurn = this._hostState.currentTurn;
    this._hostState.players.forEach(player => {
      const playerState = Object.assign({}, mutualPlayerState);
      if (currentTurn) {
        playerState.currentTurn = {
          player: currentTurn.player.name
        };
        if (currentTurn.player === player) {
          playerState.currentTurn.turnId = currentTurn.turnId;
          playerState.currentTurn.word = currentTurn.word.value;
        }
      }

      player.conn.send(playerState);
    });
  }
}
