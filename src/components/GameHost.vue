<template>
  <section v-if="!gameInProgress">
    <div class="tags has-addons">
      <span class="tag is-medium">Game ID</span>
      <span class="tag is-dark is-medium">{{ gameId || "Hosting..." }}</span>
      <button v-if="gameId" class="tag button is-medium" v-on:click="copyJoinUrl">
        <span class="icon is-small">
          <i class="fas fa-link"></i>
        </span>
        <span>Copy join URL</span>
      </button>
    </div>
    <b-button v-if="gameId" type="is-warning" @click="startGame">START GAME</b-button>
  </section>
</template>

<script>
import WordBowlHostController from "../js/host-controller";
export default {
  props: {
    hostGameController: WordBowlHostController
  },

  data() {
    return {
      gameId: null,
      gameInProgress: false,
      nextRoundStarter: null
    };
  },
  created() {
    this.hostGameController.gameId().then(gameId => {
      this.gameId = gameId;
    });

    this.hostGameController.onRoundFinished(nextRoundStarter => {
      this.gameInProgress = false;
      this.nextRoundStarter = nextRoundStarter;
    });
  },
  methods: {
    startGame() {
      if (this.nextRoundStarter) {
        this.nextRoundStarter().then(() => {
          this.gameInProgress = true;
          this.nextRoundStarter = null;
        });
      } else {
        this.hostGameController.startGame().then(() => {
          this.gameInProgress = true;
        });
      }
    },
    copyJoinUrl() {
      const url = new URL(location.href);
      const searchParams = new URLSearchParams(url.search);
      searchParams.append("gameId", this.gameId);

      navigator.clipboard
        .writeText(`${url.origin}${url.pathname}?${searchParams.toString()}`)
        .then(() => {
          this.$buefy.toast.open({ message: "Game URL copied to clipboard", type: "is-info" });
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: "Failed to copy Game URL to clipboard. Copy it manualy :(",
            type: "is-danger"
          });
        });
    }
  }
};
</script>
