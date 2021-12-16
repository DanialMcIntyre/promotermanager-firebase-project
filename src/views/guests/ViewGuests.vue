<template>
  <div>
    <h1>View guests</h1>
    <p><router-link to="/guests">Back</router-link></p> <br/>

    <table style="margin-left:auto; margin-right:auto; width: 1000px;">
      <tr>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Email</th>
        <th>Phone Number</th>
      </tr>

      <tr v-for="guest in guests" v-bind:key="guest">
        <td> {{guest.firstname}}</td>
        <td> {{guest.lastname}}</td>
        <td> {{guest.email}}</td>
        <td> {{guest.phonenumber}}</td>
      </tr>

    </table>

  </div>



</template>

<script>
import {useRouter, useRoute} from 'vue-router';
import {onBeforeMount} from 'vue';
import firebase from 'firebase';
import db from '../../main';

export default {

  data() {
    return {
      guests: []
    }
  },

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

  //Gets data from database
  created() {

    const user = firebase.auth().currentUser;

    db.collection("users").doc(user.email).collection('guests').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        //Puts data into guest object
        this.guests.push(doc.data())
      });
    });
  }

}
</script>
