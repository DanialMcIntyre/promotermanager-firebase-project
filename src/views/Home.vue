<template>
  <div class="home">
    <h1>Welcome, {{name}}</h1>
    <router-link to="/about">About</router-link>
    <br/>
    <button class="logout" @click="Logout">Logout</button>
  </div>
</template>

<script>
import {ref, onBeforeMount} from 'vue';
import firebase from 'firebase';

export default {
  setup() {
    const name = ref("");

    onBeforeMount(() => {
      const user = firebase.auth().currentUser;
      if(user) {
        name.value = user.email.split('@')[0];
      }
    });

    const Logout = () => {
      firebase.auth()
        .signOut()
        .then(() => console.log("Signed out"))
        .catch(err => alert(err.message));
    }

    return {
      Logout,
      name
    }
  }
}
</script>