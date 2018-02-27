<template>
  <v-app>
    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-title>Robo Laura Hall</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon href="https://github.com/gabedanon/robo-laura-hall" target="_blank">
        <font-awesome-icon :icon="['fab', 'github']" size="2x" />
      </v-btn>
    </v-toolbar>
    <v-content>
      <slot />
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'ApplicationLayout'
}
</script>

<style>

</style>
