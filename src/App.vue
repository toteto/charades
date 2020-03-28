<template>
  <div id="app">
    <div class="columns is-centered">
      <div class="column is-narrow">
        <section class="section">
          <GameHeader />
        </section>
        <section class="section" style="padding-top: 0" v-if="!hostController && !clientData">
          <GameStarter
            v-bind:predefinedGameId="predefinedGameId"
            v-on:host-game="onHostGame"
            v-on:join-game="onJoinGame"
          />
        </section>
        <section class="section" style="padding: 0.5rem 1.5rem" v-if="hostController">
          <GameHost v-bind:hostGameController="hostController" />
        </section>
        <section class="section" style="padding-top: 0.5rem" v-if="clientData">
          <GameClient
            v-bind:gameId="clientData.gameId"
            v-bind:clientGameController="clientData.controller"
          />
        </section>
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
