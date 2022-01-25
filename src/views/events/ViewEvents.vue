<template>
  <div>
    <h1>View Events</h1>

    <p><router-link to="/events">Back</router-link></p>

    <input type="text" v-model="search" placeholder="Search Events"/> <br/><br/>

    <select @change="changeSortType" id="dropdownSortType">
      <option selected="selected" disabled>Select sorting type</option>
      <option value="eventnameasc">Event Name - Ascending</option>
      <option value="eventnamedes">Event Name - Descending</option>
      <option value="venueasc">Venue - Ascending</option>
      <option value="venuedes">Venue - Descending</option>
      <option value="dateasc">Date - Ascending</option>
      <option value="datedes">Date - Descending</option>
      <option value="timeasc">Time - Ascending</option>
      <option value="timedes">Time - Descending</option>
    </select> <br/><br/>

    <table style="margin-left:auto; margin-right:auto; width: 1000px;">
      <tr>
        <th>Event Name</th>
        <th>Venue</th>
        <th>Date</th>
        <th>Time</th>
      </tr>

      <tr v-for="event in filteredEvents" v-bind:key="event">
        <td><router-link :to="{ name: 'Event', params: { eventdetails: event.eventname} }">{{event.eventname}}</router-link></td>
        <td>{{event.venue}}</td>
        <td>{{event.date}}</td>
        <td>{{event.time}}</td>
        <td><button @click="deleteEvent(event.eventname)">Delete Event</button></td>
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
      events: [],
      search: '',
      sortType: ''
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
        } else if (!user.emailVerified) {
          router.replace('verifyaccount')
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
          //Puts data into event object
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
  },

  methods: {
    
    //Changes sort type when user uses dropdown menu
    changeSortType() {
      this.sortType = document.getElementById("dropdownSortType").value;

      if(this.sortType == "eventnameasc") {
        this.events.sort((a,b) => (a.eventname > b.eventname) ? 1 : ((b.eventname > a.eventname) ? -1 : 0))
      } else if (this.sortType == "eventnamedes") {
        this.events.sort((a,b) => (a.eventname < b.eventname) ? 1 : ((b.eventname < a.eventname) ? -1 : 0))
      } else if (this.sortType == "venueasc") {
        this.events.sort((a,b) => (a.venue > b.venue) ? 1 : ((b.venue > a.venue) ? -1 : 0))
      } else if (this.sortType == "venuedes") {
        this.events.sort((a,b) => (a.venue < b.venue) ? 1 : ((b.venue < a.venue) ? -1 : 0))
      } else if (this.sortType == "dateasc") {
        this.events.sort((a,b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0))
      } else if (this.sortType == "datedes") {
        this.events.sort((a,b) => (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0))
      } else if (this.sortType == "timeasc") {
        this.events.sort((a,b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0))
      } else if (this.sortType == "timedes") {
        this.events.sort((a,b) => (a.time < b.time) ? 1 : ((b.time < a.time) ? -1 : 0))
      }
    },

    //Deletes event
    deleteEvent(name) {
      const user = firebase.auth().currentUser;

      var confirm = prompt("Are you sure you want to delete the event titled " + name + "? You will NOT be able to undo this action! Type 'YES' to confirm");
      if (confirm == "YES") {
        //Gets document ID to delete it
        db.collection("users").doc(user.email).collection("events").where('eventname', '==', name).get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            db.collection("users").doc(user.email).collection("events").doc(doc.id).delete().then(() => {
              alert("The event titled " + name + " has been deleted.");
              window.location.reload();
            }).catch((error) => {
              console.error("Error removing document: ", error);
            });
          });
        })
      } else {
        alert("You have cancelled deletion");
      }
    }
  }
}

</script>
