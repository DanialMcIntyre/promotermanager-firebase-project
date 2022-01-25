<template>
  <div>
    <h1>Welcome, {{name}} </h1>
    <router-link to="/about">About</router-link> <br/> <br/>
    <router-link to="/guests">Guests</router-link> <br/> <br/>
    <router-link to="/events">Events</router-link> <br/>
    <p><router-link to="/profile">Profile</router-link></p>
    <button class="logout" @click="Logout">Logout</button>
  </div>
</template>

<script>
import { ref, onBeforeMount } from "vue";
import { useRouter, useRoute } from "vue-router";
import firebase from "firebase";
import db from "../main";

export default {

  setup() {
    
    const router = useRouter();
    const route = useRoute();
    onBeforeMount(() => {
      firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
          router.replace("/login"); //Send user to login page if not logged in
        } else if (!user.emailVerified) {
          router.replace('/verifyaccount') //Send user to verification page if not verified
        } else if (route.path == "/login" || route.path == "/register") {
          router.replace("/"); //Send user to home if attempting to go to login page
        } else if (route.path != "/") {
          router.replace("/") //Change url to home if url does not exist
        }
      });
    });

    //Display username
    const name = ref("");
    onBeforeMount(() => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          db.collection("users").doc(user.email).get()
            .then((doc) => {
              name.value = doc.data().username;
            })
            .catch((err) => {
              console.log("Error getting document", err);
            });
        } else {
          console.log(user.email);
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
      Logout,
      name
    };
  },
};
</script>