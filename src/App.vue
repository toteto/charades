<template>
  <div id="app">
    <div class="columns is-centered">
      <div class="column is-half">
        <GameHeader class="section" />
        <GameStarter
          v-if="!hostController && !clientData"
          v-bind:predefinedGameId="predefinedGameId"
          v-on:host-game="onHostGame"
          v-on:join-game="onJoinGame"
        />
        <GameHost v-if="hostController" v-bind:hostGameController="hostController" />
        <GameClient
          v-if="clientData"
          v-bind:gameId="clientData.gameId"
          v-bind:clientGameController="clientData.controller"
        />
      </div>
    </div>
  </div>
</template>

<script>
import WordBowlHostController from "./js/host-controller.js";
import ClientController from "./js/client-controller.js";

import GameStarter from "./components/GameStarter.vue";
import GameHeader from "./components/GameHeader.vue";
import GameHost from "./components/GameHost";
import GameClient from "./components/GameClient";

export default {
  data() {
    const urlSearchParams = new URLSearchParams(new URL(window.location.href).search);

    return {
      predefinedGameId: urlSearchParams.get("gameId"),
      hostController: null,
      clientData: null
    };
  },

  methods: {
    onHostGame(gameHostInfo) {
      this.hostController = WordBowlHostController.create();
      this.hostController.gameId().then(gameId => {
        this.clientData = {
          controller: ClientController.create({
            name: gameHostInfo.name,
            words: gameHostInfo.words
          }),
          gameId: gameId
        };
      });
    },
    onJoinGame(gameJoinInfo) {
      this.clientData = {
        controller: ClientController.create({
          name: gameJoinInfo.name,
          words: gameJoinInfo.words
        }),
        gameId: gameJoinInfo.gameId
      };
    }
  },
  name: "App",
  components: {
    GameStarter,
    GameHeader,
    GameHost,
    GameClient
  }
};
</script>

<style lang="scss">
@import url("https://use.fontawesome.com/releases/v5.2.0/css/all.css");
@import "~bulma/sass/utilities/_all";
@import "~bulma";
@import "~buefy/src/scss/buefy";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
