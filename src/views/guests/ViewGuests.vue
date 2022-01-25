<template>
  <div>
    <h1>View guests</h1>
    <p><router-link to="/guests">Back</router-link></p>

    <input type="text" v-model="search" placeholder="Search Guests"/> <br/><br/>

    <select @change="changeSortType" id="dropdownSortType">
      <option selected="selected" disabled>Select sorting type</option>
      <option value="firstnameasc">First Name - Ascending</option>
      <option value="firstnamedes">First Name - Descending</option>
      <option value="lastnameasc">Last Name - Ascending</option>
      <option value="lastnamedes">Last Name - Descending</option>
      <option value="emailasc">Email - Ascending</option>
      <option value="emaildes">Email - Descending</option>
      <option value="phonenumberasc">Phonenumber - Ascending</option>
      <option value="phonenumberdes">Phonenumber - Descending</option>
    </select> <br/><br/>

    <table style="margin-left:auto; margin-right:auto; width: 1000px;">
      <tr>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Email</th>
        <th>Phone Number</th>
      </tr>

      <tr v-for="guest in filteredGuests" v-bind:key="guest">
        <td> {{guest.firstname}}</td>
        <td> {{guest.lastname}}</td>
        <td> {{guest.email}}</td>
        <td> {{guest.phonenumber}}</td>
        <td> <button @click="deleteGuest(guest.firstname, guest.lastname, guest.email, guest.phonenumber)">Delete Guest</button></td>
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
      guests: [],
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

      db.collection("users").doc(user.email).collection('guests').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
          //Puts data into guest object
          this.guests.push(doc.data())
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

    //Changes sort type when user uses dropdown menu
    changeSortType() {  
      this.sortType = document.getElementById("dropdownSortType").value;

      if(this.sortType == "firstnameasc") {
        this.guests.sort((a,b) => (a.firstname > b.firstname) ? 1 : ((b.firstname > a.firstname) ? -1 : 0))
      } else if (this.sortType == "firstnamedes"){
        this.guests.sort((a,b) => (a.firstname < b.firstname) ? 1 : ((b.firstname < a.firstname) ? -1 : 0))
      } else if (this.sortType == "lastnameasc") {
        this.guests.sort((a,b) => (a.lastname > b.lastname) ? 1 : ((b.lastname > a.lastname) ? -1 : 0))
      } else if (this.sortType == "lastnamedes") {
        this.guests.sort((a,b) => (a.lastname < b.lastname) ? 1 : ((b.lastname < a.lastname) ? -1 : 0))
      } else if (this.sortType == "emailasc") {
        this.guests.sort((a,b) => (a.email > b.email) ? 1 : ((b.email > a.email) ? -1 : 0))
      } else if(this.sortType == "emaildes") {
        this.guests.sort((a,b) => (a.email < b.email) ? 1 : ((b.email < a.email) ? -1 : 0))
      } else if (this.sortType == "phonenumberasc") {
        this.guests.sort((a,b) => (a.phonenumber > b.phonenumber) ? 1 : ((b.phonenumber > a.phonenumber) ? -1 : 0))
      } else if (this.sortType == "phonenumberdes") {
        this.guests.sort((a,b) => (a.phonenumber < b.phonenumber) ? 1 : ((b.phonenumber < a.phonenumber) ? -1 : 0))
      }
    },

    //Deletes guest
    deleteGuest(firstname, lastname, email, phonenumber) {
      const user = firebase.auth().currentUser;

      var confirm = prompt("Are you sure you want to delete the guest " + firstname + " " + lastname + "? You will NOT be able to undo this action! Type 'YES' to confirm");
      if (confirm == "YES") {
        //Gets document ID to delete it
        db.collection("users").doc(user.email).collection("guests").where('firstname', '==', firstname).where('lastname', '==', lastname).where('email', '==', email).where('phonenumber', '==', phonenumber).get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            db.collection("users").doc(user.email).collection("guests").doc(doc.id).delete().then(() => {
              alert("The guest " + firstname + " " + lastname + " has been deleted." + doc.id);
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

  },

}
</script>
