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
import db from '../../main';

export default {
  
  setup() {

    //Register with email and pass
    const email = ref("");
    const password = ref("");
    const Register = () => {
      firebase.auth()
        .createUserWithEmailAndPassword(email.value, password.value)
        .then(() => {

          //Create event and guest collection in database when account is created
          db.collection('users').doc(email.value).set({});
          db.collection('users').doc(email.value).collection('guests').doc('temp').set({});
          db.collection('users').doc(email.value).collection('events').doc('temp').set({});
            
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