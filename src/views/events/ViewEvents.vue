<template>
  <div>
    <h1>View Events</h1>

    <input type="text" v-model="search" placeholder="Search Events"/> <br/><br/>

    <table style="margin-left:auto; margin-right:auto; width: 1000px;">
      <tr>
        <th>Event Name <button @click="sortByName" id="name" disabled>Sort</button></th>
        <th>Venue <button @click="sortByVenue" id="venue">Sort</button></th>
        <th>Date <button @click="sortByDate" id="date">Sort</button></th>
        <th>Time <button @click="sortByTime" id="time">Sort</button></th>
      </tr>

      <tr v-for="event in filteredEvents" v-bind:key="event">
        <td><router-link :to="{ name: 'Event', params: { eventdetails: event.eventname, name: event.eventname, venue: event.venue, date: event.date, time: event.time} }">{{event.eventname}}</router-link></td>
        <td>{{event.venue}}</td>
        <td>{{event.date}}</td>
        <td>{{event.time}}</td>
        <td><button @click="deleteEvent(event.eventname)">Delete Event</button></td>
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
      search: '',
      sortType: 'name'
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
          //Puts data into event object
          this.events.push(doc.data())
          this.sortArray();
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
    sortByName() {
      this.sortType = "name";
      this.sortArray();
      document.getElementById("name").disabled = true;
      document.getElementById("venue").disabled = false;
      document.getElementById("date").disabled = false;
      document.getElementById("time").disabled = false;
    },
    sortByVenue() {
      this.sortType = "venue";
      this.sortArray();
      document.getElementById("name").disabled = false;
      document.getElementById("venue").disabled = true;
      document.getElementById("date").disabled = false;
      document.getElementById("time").disabled = false;
    },
    sortByDate() {
      this.sortType = "date";
      this.sortArray();
      document.getElementById("name").disabled = false;
      document.getElementById("venue").disabled = false;
      document.getElementById("date").disabled = true;
      document.getElementById("time").disabled = false;
    },
    sortByTime() {
      this.sortType = "time";
      this.sortArray();
      document.getElementById("name").disabled = false;
      document.getElementById("venue").disabled = false;
      document.getElementById("date").disabled = false;
      document.getElementById("time").disabled = true;
    },
    sortArray() {
      //Sorts the array
      if(this.sortType == "name") {
        this.events.sort((a,b) => (a.eventname > b.eventname) ? 1 : ((b.eventname > a.eventname) ? -1 : 0))
      } else if (this.sortType == "venue") {
        this.events.sort((a,b) => (a.venue > b.venue) ? 1 : ((b.venue > a.venue) ? -1 : 0))
      } else if (this.sortType == "date") {
        this.events.sort((a,b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0))
      } else if (this.sortType == "time") {
        this.events.sort((a,b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0))
      }
    },

    //Deletes event
    deleteEvent(name) {

      firebase.auth().onAuthStateChanged(user => {

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
      });
    }
  }
}

</script>
