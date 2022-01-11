<template>
  <div>
    <h1>View guests</h1>
    <p><router-link to="/guests">Back</router-link></p> <br/>

    <input type="text" v-model="search" placeholder="Search Guests"/> <br/><br/>

    <table style="margin-left:auto; margin-right:auto; width: 1000px;" id="table">
      <tr>
        <th>First Name <button @click="sortByName" id="first" disabled>Sort</button></th>
        <th>Last Name <button @click="sortByLastName" id="last">Sort</button></th>
        <th>Email <button @click="sortByEmail" id="email">Sort</button></th>
        <th>Phone Number <button @click="sortByPhonenumber" id="number">Sort</button></th>
      </tr>

      <tr v-for="guest in filteredGuests" v-bind:key="guest">
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
      guests: [{
        firstname: 'John',
        lastname: 'Hilbert',
        email: 'johnhilbert@gmail.com',
        phonenumber: '5555555555'
      }
      ],
      search: '',
      sortType: 'firstName'
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

      db.collection("users").doc(user.email).collection('guests').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
          //Puts data into guest object
          this.guests.push(doc.data())

          this.sortArray();

        });
      });
    });
  },

  //Filter guests by searchbar
  computed: {
    filteredGuests: function() {
      return this.guests.filter((guest) => {
        return guest.firstname.match(this.search) || guest.lastname.match(this.search) || guest.phonenumber.match(this.search) || guest.email.match(this.search);
      });
    }
  },

  methods: {

    sortByName() {
      this.sortType = "firstName";
      this.sortArray();
      document.getElementById("first").disabled = true;
      document.getElementById("last").disabled = false;
      document.getElementById("email").disabled = false;
      document.getElementById("number").disabled = false;
    },
    sortByLastName() {
      this.sortType = "lastName";
      this.sortArray();
      document.getElementById("first").disabled = false;
      document.getElementById("last").disabled = true;
      document.getElementById("email").disabled = false;
      document.getElementById("number").disabled = false;
    },
    sortByEmail() {
      this.sortType = "email";
      this.sortArray();
      document.getElementById("first").disabled = false;
      document.getElementById("last").disabled = false;
      document.getElementById("email").disabled = true;
      document.getElementById("number").disabled = false;
    },
    sortByPhonenumber() {
      this.sortType = "phonenumber";
      this.sortArray();
      document.getElementById("first").disabled = false;
      document.getElementById("last").disabled = false;
      document.getElementById("email").disabled = false;
      document.getElementById("number").disabled = true;
    },

    sortArray() {
      //Sorts the array
      if(this.sortType == "firstName") {
        this.guests.sort((a,b) => (a.firstname > b.firstname) ? 1 : ((b.firstname > a.firstname) ? -1 : 0))
      } else if (this.sortType == "lastName") {
        this.guests.sort((a,b) => (a.lastname > b.lastname) ? 1 : ((b.lastname > a.lastname) ? -1 : 0))
      } else if (this.sortType == "email") {
        this.guests.sort((a,b) => (a.email > b.email) ? 1 : ((b.email > a.email) ? -1 : 0))
      } else if (this.sortType == "phonenumber") {
        this.guests.sort((a,b) => (a.phonenumber > b.phonenumber) ? 1 : ((b.phonenumber > a.phonenumber) ? -1 : 0))
      }
    }

  },

}
</script>
