<template>
  <div class="register">
      <h1>Register</h1>
      <form @submit.prevent="Register">
        <input type="text" placeholder="Username" v-model="username" required/> <br/>
        <input type="text" placeholder="Email" v-model="email" required/> <br/>
        <input type="password" placeholder="Password" v-model="password" required/> <br/>
        <input type="password" placeholder="Confirm Password" v-model="confirmpassword" required/> <br/>
        <input type="tel" placeholder="Phone Number (optional)" v-model="phonenumber"/> <br/> <br/>
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
    const username = ref("");
    const email = ref("");
    const password = ref("");
    const confirmpassword = ref("");
    const phonenumber = ref("");
    const Register = () => {
      //Checks to see if passwords match
      if (password.value == confirmpassword.value) {
        firebase.auth()
          .createUserWithEmailAndPassword(email.value, password.value)
          .then(() => {

            //Create event and guest collection in database when account is created
            db.collection('users').doc(email.value).set({username: username.value});
            db.collection('users').doc(email.value).collection('guests').doc('temp').set({});
            db.collection('users').doc(email.value).collection('events').doc('temp').set({});
              
          })
          .catch(err => alert(err.message));
      } else {
        alert("Your passwords do not match!");
      }
    }

    return {
      Register,
      username,
      email,
      password,
      confirmpassword,
      phonenumber
    }
  }
}

</script>