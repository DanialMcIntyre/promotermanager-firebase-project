<template>
  <div>
    <h1>{{ name }}</h1>

    <p1>This event will take place at <input type="text" id="venue"> </p1>
    <button @click="changeVenue">Change Venue</button> <br/><br/>

    <p1>On <input type="text" id="date" onfocus="(this.type='date')" onblur="(this.type='text')"></p1>
    <button @click="changeDate">Change Date</button> <br/><br/>

    <p1>At <input type="text" id="time" onfocus="(this.type='time')" onblur="(this.type='text')"></p1>
    <button @click="changeTime">Change Time</button> <br/><br/>

    <textarea rows="5" maxlength="250" id="desc" style="resize: none; width: 30%; height: 75px; overflow:hidden"></textarea>
    <br/><button @click="changeDesc">Update Description</button> <br/><br/>

    <p><router-link to="/events/viewevents">Back</router-link></p>
  </div>
</template>

<script>
import {useRouter, useRoute} from 'vue-router';
import {onBeforeMount} from 'vue';
import firebase from 'firebase';
import db from '../../main';

var docID;

export default {

  data () {
    return {
      name: this.$route.params.name,
      venue: this.$route.params.venue,
      date: this.$route.params.date,
      time: this.$route.params.time,
      desc: this.$route.params.desc
    }
  },
  created() {

    firebase.auth().onAuthStateChanged(user => {

      //Gets document ID from database
      db.collection("users").doc(user.email).collection("events").where('eventname', '==', this.name).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          docID = doc.id;
          db.collection("users").doc(user.email).collection("events").doc(docID).get().then(doc => {
            document.getElementById("venue").placeholder = doc.data().venue;
            document.getElementById("date").placeholder = doc.data().date;
            document.getElementById("time").placeholder = doc.data().time;
            document.getElementById("desc").placeholder = doc.data().desc;
          })
        });
      }).catch(err => {
        console.log('Error getting document', err);
      });

    });

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

  methods: {

    //Change venue
    changeVenue: function () {
      if (document.getElementById("venue").value.trim() != "") {

        const user = firebase.auth().currentUser;

        db.collection('users').doc(user.email).collection("events").doc(docID).update({
          venue: document.getElementById("venue").value
        })
        alert("The venue has been changed to " + document.getElementById("venue").value);
      }

    },

    //Change date
    changeDate: function () {
      if (document.getElementById("date").value.trim() != "") {

        const user = firebase.auth().currentUser;

        db.collection('users').doc(user.email).collection("events").doc(docID).update({
          date: document.getElementById("date").value
        })
        alert("The date has been changed to " + document.getElementById("date").value);
      }

    },

    //Change time
    changeTime: function () {
      if (document.getElementById("time").value.trim() != "") {

        const user = firebase.auth().currentUser;

        db.collection('users').doc(user.email).collection("events").doc(docID).update({
          time: document.getElementById("time").value
        })
        alert("The time has been changed to " + document.getElementById("time").value);
      }

    },

    //Change description
    changeDesc: function () {
      if (document.getElementById("desc").value.trim() != "") {

        const user = firebase.auth().currentUser;

        db.collection('users').doc(user.email).collection("events").doc(docID).update({
          desc: document.getElementById("desc").value
        })
        alert("The description has successfully been changed");
      }

    },

  }

}
</script>
