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
import {useRouter, useRoute} from 'vue-router';
import firebase from 'firebase';

export default {

  setup() {

    //Send user back to login if not logged in
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

    //Display username
    const name = ref("");
    onBeforeMount(() => {
      const user = firebase.auth().currentUser;
      if(user) {
        name.value = user.email.split('@')[0];
      }
    });

    //Logout
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