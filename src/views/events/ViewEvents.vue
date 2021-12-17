<template>
  <div>
    <h1>View Events</h1>

    <table style="margin-left:auto; margin-right:auto; width: 1000px;">
      <tr>
        <th>Event Name</th>
        <th>Venue</th>
        <th>Date</th>
        <th>Time</th>
      </tr>

      <tr v-for="event in events" v-bind:key="event">
        <td> {{event.eventname}}</td>
        <td> {{event.venue}}</td>
        <td> {{event.date}}</td>
        <td> {{event.time}}</td>
      </tr>

    </table>

    <p><router-link to="/events">Back</router-link></p>
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
      events: []
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

    db.collection("users").doc(user.email).collection('events').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        //Puts data into guest object
        this.events.push(doc.data())
      });
    });
  }

}
</script>
