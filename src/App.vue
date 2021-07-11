<template>
  <v-app>
    <v-app-bar color="black" >
      <v-img
        class="mx-2"
        src="./assets/logo1.png"
        max-height="100"
        max-width="100"
        contain
      />

   
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>
