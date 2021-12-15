<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="Login">
      <input type="text" placeholder="Email" v-model="email" />
      <input type="password" placeholder="Password" v-model="password" />
      <input type="submit" placeholder="Login" />
      <br /><br />
      <button @click="googleSignIn">Login with Google</button>
      <p><router-link to="/register">Sign up</router-link></p>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import firebase from "firebase";

export default {

  setup() {

    //Login with email and pass
    const email = ref("");
    const password = ref("");
    const Login = () => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email.value, password.value)
        .then((data) => console.log(data))
        .catch((err) => alert(err.message));
    };

    return {
      Login,
      email,
      password,
    };
  },
  
  methods: {

    //Login with Google
    googleSignIn: function () {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(() => {
          alert("Signed in!");
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style>
</style>