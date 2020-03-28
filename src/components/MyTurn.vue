<template>
  <div class="card">
    <div class="card-header">
      <p class="card-header-title">Your turn</p>
    </div>
    <div class="card-content">
      <p class="title">{{ word }}</p>
    </div>
    <div class="card-footer">
      <a class="card-footer-item" @click="correctAction()">Correct</a>
      <a class="card-footer-item is-danger" @click="incorrectAction()">Incorrect</a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    word: String,
    correctAction: Function,
    incorrectAction: Function
  }
};
</script>
