<template>
  <div>
    <h1>Events</h1>
    <p><router-link to="/events/createevent">Create an event</router-link></p>
    <p><router-link to="/events/viewevents">View events</router-link></p>
    <p><router-link to="/">Home</router-link></p>
  </div>
</template>

<script>
import {useRouter, useRoute} from 'vue-router';
import {onBeforeMount} from 'vue';
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

  }
}
</script>
