<template>
  <div>
    <h1>{{ name }}</h1>

    <p>This event will take place at {{venue}} on {{date}} at {{time}}</p>

    <p><router-link to="/events/viewevents">Back</router-link></p>
  </div>
</template>

<script>
import {useRouter, useRoute} from 'vue-router';
import {onBeforeMount} from 'vue';
import firebase from 'firebase';

export default {

  data () {
    return {
      name: this.$route.params.name,
      venue: this.$route.params.venue,
      date: this.$route.params.date,
      time: this.$route.params.time
    }
  },
  created() {
  },

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

  },

}
</script>
