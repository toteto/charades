<template>
  <section>
    <b-field label="Your name">
      <b-input placeholder="Add name" v-model="name"></b-input>
    </b-field>
    <b-field label="Words">
      <b-taginput ellipsis maxtags="5" placeholder="Add words" v-model="words"></b-taginput>
    </b-field>

    <p class="label">Join existing game</p>
    <b-field grouped>
      <b-input class="is-expanded" placeholder="Game ID" v-model="gameId"></b-input>
      <p class="control">
        <button
          class="button is-primary"
          v-bind:disabled="!validJoinInfo"
          v-on:click="$emit('join-game', { gameId: gameId, name: name, words: words })"
        >
          Join
        </button>
      </p>
    </b-field>
    <b-field label="Or, host new one">
      <p class="control">
        <button
          class="button"
          v-bind:disabled="!validHostInfo"
          v-on:click="$emit('host-game', { name: name, words: words })"
        >
          Host new game
        </button>
      </p>
    </b-field>
  </section>
</template>

<script>
export default {
  props: {
    predefinedGameId: String
  },
  data() {
    return {
      gameId: this.$props.predefinedGameId,
      name: "",
      words: []
    };
  },
  computed: {
    validJoinInfo() {
      return this.validHostInfo && this.gameId?.trim().length > 0;
    },
    validHostInfo() {
      return this.name.trim().length > 0 && this.words.length > 0;
    }
  }
};
</script>
