<template>
  <div>
    <h1>Profile</h1>
    <p1>Username: </p1>
    <input type="text" id="username">
    <button @click="changeUsername">Change Username</button>
    <br/>
    <p1>Phone number: </p1>
    <input type="tel" id="phonenumber">
    <button @click="changePhonenumber">Change Phone number</button>
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
        } else if (route.path == "/login" || route.path == "/register") {
          router.replace('/');
        }
      });
    });
  },

  data() {
    return {
      username: '',
      phonenumber: ''
    }
  },

  //Gets username and phonenumber from database
  created() {

    firebase.auth().onAuthStateChanged(user => {

      db.collection("users").doc(user.email).get().then(doc => {
        this.username = doc.data().username;
        this.phonenumber = doc.data().phonenumber;
        document.getElementById("username").placeholder = this.username;
        document.getElementById("phonenumber").placeholder = this.phonenumber;
        if (doc.data().phonenumber == "" || doc.data().phonenumber == null) {
          this.phonenumber = 'None';
        } else {
          this.phonenumber = doc.data().phonenumber;
        }
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
