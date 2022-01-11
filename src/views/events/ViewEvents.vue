<template>
  <div>
    <h1>View Events</h1>

    <input type="text" v-model="search" placeholder="Search Events"/> <br/><br/>

    <table style="margin-left:auto; margin-right:auto; width: 1000px;">
      <tr>
        <th>Event Name</th>
        <th>Venue</th>
        <th>Date</th>
        <th>Time</th>
      </tr>

      <tr v-for="event in filteredEvents" v-bind:key="event">
        <td><router-link :to="{ name: 'Event', params: { eventdetails: event.eventname, name: event.eventname, venue: event.venue, date: event.date, time: event.time} }">{{event.eventname}}</router-link></td>
        <td>{{event.venue}}</td>
        <td>{{event.date}}</td>
        <td>{{event.time}}</td>
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
      events: [],
      search: ''
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
    
    firebase.auth().onAuthStateChanged(user => {

      db.collection("users").doc(user.email).collection('events').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          //Puts data into guest object
          this.events.push(doc.data())
        });
      });

    });
  },

  //Filter events by searchbar
  computed: {
    filteredEvents: function() {
      return this.events.filter((event) => {
        return event.eventname.match(this.search) || event.venue.match(this.search) || event.date.match(this.search) || event.time.match(this.search);
      });
    }
  }

}
</script>
