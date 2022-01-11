<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="Login">
      <input type="text" placeholder="Email" v-model="email" /> <br/>
      <input type="password" placeholder="Password" v-model="password" /> <br/> <br/>
      <input type="submit" value="Login" />
      <p><router-link to="/passwordforgot">Forgot Password?</router-link></p>
      <button @click="googleSignIn">Login with Google</button>
      <button @click="facebookSignIn">Login with Facebook</button>
      <p><router-link to="/phonenumber">Login with Phone number</router-link></p>
      <p><router-link to="/register">Sign up</router-link></p>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import firebase from "firebase";
import db from '../../main';

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
        .then((result) => {

          //Create event and guest collection in database when account is created
          const email = result.user.email;
          
          db.collection('users').doc(email).set({username: email, phonenumber: 'None'});

          alert("Signed in!");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    facebookSignIn: function () {
      const provider = new firebase.auth.FacebookAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {

          //Create event and guest collection in database when account is created
          const email = result.user.email;
          
          db.collection('users').doc(email).set({username: email, phonenumber: 'None'});

          alert("Signed in!");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
};
</script>

<style>
</style>