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
      <b-input placeholder="Game ID" v-model="gameId"></b-input>
      <p class="control">
        <button
          class="button"
          v-on:click="$emit('join-game', { gameId: gameId, name: name, words: words })"
        >
          Join
        </button>
      </p>
    </b-field>
    <b-field label="Or, host new one">
      <p class="control">
        <button
          class="button is-primary"
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
  }
};
</script>
