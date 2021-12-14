<template>
  <router-view/>
</template>

<script>

import { onBeforeMount} from 'vue';
import { useRouter, useRoute} from 'vue-router';
import firebase from 'firebase';

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();

    onBeforeMount(() =>  {
      firebase.auth().onAuthStateChanged((user) => {
        if(!user) {
          router.replace('/login');
        } else if (route.path == "/login" || route.path == "/register") {
          router.replace('/');
        }
      });
    });

  }  
}

</script>

<style>

body {
  background: #2c3e50;
  color: white;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

a {
  color: inherit;
}

</style>
