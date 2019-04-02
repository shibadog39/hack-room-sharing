<template>
  <v-app>
    <v-toolbar app class="primary">
      <v-toolbar-title class="headline text-uppercase">
        <span>refactor-room-sharing</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import HelloWorld from "./components/HelloWorld.vue";
import Payment from "./components/Payment.vue";

@Component({
  components: {
    HelloWorld,
    Payment
  }
})
export default class App extends Vue {}
</script>
