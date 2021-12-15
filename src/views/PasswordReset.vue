<template>
  <div class="register">
      <h1>Reset Password</h1>
      <form @submit.prevent="Register">
        <button @click="resetPassword">Send Reset Password Email</button>
        <p><router-link to="/">Home</router-link></p>
      </form>
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  
  methods: {

    //Reset Password
    resetPassword() {

        const auth = firebase.auth();
        auth.sendPasswordResetEmail(auth.currentUser.email)
        .then(() => {
            console.log("Email sent");
        })
        .catch((error) => {
            console.log(error);
        });
          
    }
  }

}

</script>