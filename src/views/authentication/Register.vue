<template>
  <div class="register">
      <h1>Register</h1>
      <form @submit.prevent="Register">
        <input type="text" placeholder="Email" v-model="email"/>
        <input type="password" placeholder="Password" v-model="password"/>
        <input type="submit" placeholder="Register"/>
        <p><router-link to="/login">Sign in</router-link></p>
      </form>
  </div>
</template>

<script>
import firebase from 'firebase';
import {ref} from 'vue'

export default {
  
  setup() {

    //Register with email and pass
    const email = ref("");
    const password = ref("");
    const Register = () => {
      firebase.auth()
        .createUserWithEmailAndPassword(email.value, password.value)
        .then(user => {
          alert(user);
        })
        .catch(err => alert(err.message));
    }

    return {
      Register,
      email,
      password
    }

  }
}

</script>