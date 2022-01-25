<template>
  <div>
    <h1>Profile</h1>
    <p>Email: {{email}}</p>
    <p>Username: <input type="text" id="username"> <button @click="changeUsername">Change Username</button></p>
    <p>Phone number: <input type="number" id="phonenumber"> <button @click="changePhonenumber">Change Phone number</button></p>
    <p><router-link to="/passwordreset">Reset Password</router-link></p>
    <p><router-link to="/">Home</router-link></p>
  </div>
</template>

<script>
import {useRouter, useRoute} from 'vue-router';
import {onBeforeMount} from 'vue';
import firebase from 'firebase';
import db from '../main';

export default {

  setup() {

    //Send user back to login if not logged in
    const router = useRouter();
    const route = useRoute();
    onBeforeMount(() =>  {
      firebase.auth().onAuthStateChanged((user) => {
        if(!user) {
          router.replace('/login');
        } else if (!user.emailVerified) {
          router.replace('verifyaccount')
        } else if (route.path == "/login" || route.path == "/register") {
          router.replace('/');
        }
      });
    });
  },

  data() {
    return {
      username: '',
      phonenumber: '',
      email: firebase.auth().currentUser.email
    }
  },

  //Gets username and phonenumber from database
  created() {

    firebase.auth().onAuthStateChanged(user => {

      db.collection("users").doc(user.email).get().then(doc => {
        if (doc.data().phonenumber == "" || doc.data().phonenumber == null) {
          this.phonenumber = 'None';
          alert("yoo")
        } else {
          this.phonenumber = doc.data().phonenumber;
        }
        this.username = doc.data().username;
        document.getElementById("username").placeholder = this.username;
        document.getElementById("phonenumber").placeholder = this.phonenumber;
      }).catch(err => {
          console.log('Error getting document', err);
      });
      
    });

  },

  methods: {

    //Change username
    changeUsername: function () {
      if (document.getElementById("username").value.trim() != "") {

        const user = firebase.auth().currentUser;

        db.collection('users').doc(user.email).update({
          username: document.getElementById("username").value
        })
        alert("Your username has been changed to " + document.getElementById("username").value);
      }

    },
    
    //Change phonenumber
    changePhonenumber: function () {

      if (document.getElementById("phonenumber").value.trim() != "") {

        const user = firebase.auth().currentUser;

        db.collection('users').doc(user.email).update({
          phonenumber: document.getElementById("phonenumber").value
        })
        alert("Your phone number has been changed to " + document.getElementById("phonenumber").value);
      }
    }    
  }
}
</script>
