<template>
  <div class="section">
    <div class="field is-grouped is-grouped-multiline">
      <div class="control" v-for="player in players" :key="player.name">
        <div class="tags has-addons are-small">
          <span class="tag">{{ player.name }}</span>
          <span class="tag is-info">{{ player.score }}</span>
        </div>
      </div>
    </div>
    <MyTurn
      v-if="myTurn"
      v-bind:word="myTurn.word"
      v-bind:correctAction="myTurn.correctAction"
      v-bind:incorrectAction="myTurn.incorrectAction"
    />
  </div>
</template>

<script>
import ClientController from "../js/client-controller";
import MyTurn from "./MyTurn";
export default {
  props: {
    gameId: String,
    clientGameController: ClientController
  },
  data() {
    return {
      players: null,
      currentPlayer: null,
      myTurn: null
    };
  },
  created() {
    const joinGame = () =>
      this.clientGameController
        .joinGame(this.gameId)
        .then(() => {
          console.log(`Connected to ${this.gameId}`);
        })
        .catch(() => {
          this.$buefy.dialog.confirm({
            message: "Failed connecting to game. Try again?",
            onConfirm: () => joinGame()
          });
        });
    joinGame();

    this.clientGameController.onPlayersReceived(players => {
      this.players = players;
    });

    this.clientGameController.onCurrentTurnReceived(currentTurn => {
      this.currentPlayer = currentTurn.player;
      this.myTurn = currentTurn.word && {
        word: currentTurn.word,
        correctAction: currentTurn.correct,
        incorrectAction: currentTurn.incorrect
      };
    });

    this.clientGameController.onNoCurrentTurnAvailable(() => {
      this.currentPlayer = null;
      this.myTurn = null;
    });
  },
  components: {
    MyTurn
  }
};
</script>
