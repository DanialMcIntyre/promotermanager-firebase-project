<template>
  <div>
    <h1>Your account is unverified!</h1>
    <button @click="sendVerification">Resend verification email</button> <br/> <br/>
    <a @click="Logout" href="#">Login</a>
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
        } else if (user.emailVerified) {
          router.replace('/')
        } else if (route.path == "/login" || route.path == "/register") {
          router.replace('/');
        }
      });
    });

    //Logout
    const Logout = () => {
      firebase.auth().signOut()
      .then(() => console.log("Signed out"))
      .catch((err) => alert(err.message));
    };

    return {
      Logout
    }

  },
  methods: {
    sendVerification() {
      const user = firebase.auth().currentUser;
      user.sendEmailVerification();
    }
  }
}
</script>
