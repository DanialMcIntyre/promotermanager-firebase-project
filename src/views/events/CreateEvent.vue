<template>
  <div>
    <h1>Create an Event</h1>
    <form id="newevent">
      Event name <input type="text" placeholder="Event Name" id="eventname" required/> <br/>
      Venue <input type="text" placeholder="Venue" id="venue" required/> <br/>
      Date <input type="date" placeholder="Date" id="date" required/> <br/>
      Time <input type="time" placeholder="Time" id="time" required/> <br/>
      <button @click="submit" type="button">Add event</button>
    </form>
    <p><router-link to="/events">Back</router-link></p>
  </div>
</template>

<script>
import {useRouter, useRoute} from 'vue-router';
import {onBeforeMount} from 'vue';
import firebase from 'firebase';
import db from '../../main';

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
      eventname: '',
      venue: '',
      date: '',
      time: '',
      desc: '',
      events: []
    }
  },
  created() {
    //Puts all current events in array
    firebase.auth().onAuthStateChanged(user => {
      db.collection("users").doc(user.email).collection('events').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
          //Puts data into guest object
          this.events.push(doc.data())
        });
      });
      
    });
  },

  methods: {

    submit() {

      //Creates guest object and puts values into it
      const event = {
        eventname: document.getElementById("eventname").value,
        venue: document.getElementById("venue").value,
        date: document.getElementById("date").value,
        time: document.getElementById("time").value,
        desc: 'Add a description to your event!'
      }

      //Checks if all fields have values
      if (event.eventname != '' && event.venue != '' && event.date != '' && event.time != '') {
        var eventExists = false;

        //Checks if event with the same name already exists
        for (const element of this.events) {
          if(element.eventname == event.eventname) {
            eventExists = true;
            alert("An event with this name already exists.")
          }
        }

        //Creates the event
        if(eventExists == false) {
          const user = firebase.auth().currentUser;

          db.collection('users').doc(user.email).collection('events').add(event);
          alert("Your event titled '" + event.eventname + "' has been created")
          document.getElementById("newevent").reset();
        }

      } else {
        alert("Please fill out the form!")
      }
    }
  } 
}
</script>
