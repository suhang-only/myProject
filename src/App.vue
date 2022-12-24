<template>
  <router-view></router-view>
</template>

<script setup>
import { useStore } from "vuex";

const store = useStore()
store.commit("addMenu")
</script>
<style>
#app {
  height: 120%;
}
</style>