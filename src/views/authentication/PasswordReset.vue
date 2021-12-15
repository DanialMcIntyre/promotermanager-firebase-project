<template>
  <div>
      <h1>Reset Password</h1>
      <button @click="resetPassword">Send Reset Password Email</button>
      <p><router-link to="/">Home</router-link></p>
  </div>
</template>

<script>
import firebase from 'firebase';
import {useRouter, useRoute} from 'vue-router';
import {onBeforeMount} from 'vue';

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
  },
  
  methods: {

    //Reset Password
    resetPassword() {
      const auth = firebase.auth();
      auth.sendPasswordResetEmail(auth.currentUser.email)
      .then(() => {
          console.log("Email sent");
      })
      .catch((error) => {
          alert(error);
      });  
    }
  }
}

</script>