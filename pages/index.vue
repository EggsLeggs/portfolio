<template>
    <vue-scroll-snap :fullscreen="true" :horizontal="true">
        <div class="item" id="one"><p>test</p></div>
        <div class="item" id="two"><p>test2</p></div>
        <div class="item" id="three"><p>test3</p></div>
        <div class="item" id="four"><p>test4</p></div>
    </vue-scroll-snap>
  </template>
  
  <script>
  import VueScrollSnap from '../components/VueScrollSnap.vue';
  export default {
    components: {
      'vue-scroll-snap': VueScrollSnap,
    },
  };
  </script>