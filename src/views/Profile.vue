<template>
  <div>
    <h1>Profile</h1>
    <p>Email: <span id="email"> </span></p>
    <p>Username: <input type="text" id="username"> <button @click="changeUsername">Change Username</button></p>
    <p>Phone number: <input type="number" id="phonenumber"> <button @click="changePhonenumber">Change Phone number</button></p>
    <p><router-link to="/passwordreset">Reset Password</router-link></p>
    <p><button @click="deleteAccount">Delete Account</button></p>
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
      email: ''
    }
  },

  //Gets username and phonenumber from database
  created() {
    firebase.auth().onAuthStateChanged(user => {
      db.collection("users").doc(user.email).get().then(doc => {
        if (doc.data().phonenumber == "" || doc.data().phonenumber == null) {
          this.phonenumber = 'None';
        } else {
          this.phonenumber = doc.data().phonenumber;
        }
        this.username = doc.data().username;
        this.email = user.email;
        document.getElementById("username").placeholder = this.username;
        document.getElementById("phonenumber").placeholder = this.phonenumber;
        document.getElementById("email").innerHTML = this.email;
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
    },
    
    //Delete account
    deleteAccount: function() {
      const user = firebase.auth().currentUser;
      var confirm = prompt("Are you sure you want to delete your account. You will not be able to undo this action! Type 'YES' to proceed");
      if (confirm == 'YES') {
        db.collection("users").doc(user.email).delete().then(() => {
          console.log("Database deleted");
        }).catch((error) => {
          console.error("Error removing document: ", error);
        });

        user.delete().then(() => {
          alert("Your account has been deleted!");
        }).catch((error) => {
          console.log(error);
        });
      
      } else {
        alert("Your account has not been deleted!");
      }
    }
  
  }
}
</script>
