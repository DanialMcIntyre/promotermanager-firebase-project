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

    <div class="dropdown">
        <button @click="openSearchDropdown" id="search_input" style="width: 250px;">Add Guest</button>
        <div id="myDropdown" class="dropdown-content" style="width: 250px;">
            <input type="text" placeholder="Search.." id="search_value" @keyup="filterSearchDropdown" class="search-area" style="width: 250px;"/>
            <div v-for="guest in guests" v-bind:key="guest">
              <span data-value="{{guest}}" @click="selectFilteredValue(guest)">{{guest.firstname + " " + guest.lastname}}</span>
            </div>
        </div>
    </div>

    <h2>Event Guest List</h2>

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

      <tr v-for="currentguest in filteredGuests" v-bind:key="currentguest">
        <td> {{currentguest.firstname}}</td>
        <td> {{currentguest.lastname}}</td>
        <td> {{currentguest.email}}</td>
        <td> {{currentguest.phonenumber}}</td>
        <td> <button @click="deleteGuest(currentguest.firstname, currentguest.lastname, currentguest.email, currentguest.phonenumber)">Delete Guest</button></td>
     
        </tr>

    </table>


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
      desc: this.$route.params.desc,
      guests: [],
      currentguests: [],
      search: '',
      sortType: ''
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

            //Get current guests
            db.collection("users").doc(user.email).collection('events').doc(docID).collection('guests').get().then((snapshot) => {
              snapshot.docs.forEach(doc => {
                //Puts data into guest object
                this.currentguests.push(doc.data())
              });
            });

          })
        });
      }).catch(err => {
        console.log('Error getting document', err);
      });

      //Get total guests
      db.collection("users").doc(user.email).collection('guests').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
          //Puts data into guest object
          this.guests.push(doc.data())
        });
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

  //Filter guests by searchbar
  computed: {
    filteredGuests: function() {
      return this.currentguests.filter((guest) => {
        return guest.firstname.match(this.search) || guest.lastname.match(this.search) || guest.phonenumber.match(this.search) || guest.email.match(this.search);
      });
    }
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

    //All dropdown search box stuff VVVVVV
    openSearchDropdown: function() {
        document.getElementById("myDropdown").classList.toggle("show");
    },

    closeSearchDropdown: function() {
        document.getElementById("myDropdown").classList.toggle("show");
    },

    selectFilteredValue: function(guest) {
        //document.getElementById("search_input").value = event.target.getAttribute("data-value");
        const user = firebase.auth().currentUser;
        db.collection('users').doc(user.email).collection('events').doc(docID).collection('guests').add(guest);
        alert(guest.firstname + " " + guest.lastname + " has been added to this event!");
        this.closeSearchDropdown();
    },

    filterSearchDropdown: function() {
        var input, filter, span, i;
        input = document.getElementById("search_value");
        filter = input.value.toUpperCase();
        var div = document.getElementById("myDropdown");
        span = div.getElementsByTagName("span");
        for (i = 0; i < span.length; i++) {
            var txtValue = span[i].textContent || span[i].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                span[i].style.display = "";
            } else {
                span[i].style.display = "none";
            }
        }
    },
    //All dropdown search box stuff ^^^^^^^^

    //Changes sort type when user uses dropdown menu
    changeSortType() {  
      this.sortType = document.getElementById("dropdownSortType").value;

      if(this.sortType == "firstnameasc") {
        this.currentguests.sort((a,b) => (a.firstname > b.firstname) ? 1 : ((b.firstname > a.firstname) ? -1 : 0))
      } else if (this.sortType == "firstnamedes"){
        this.currentguests.sort((a,b) => (a.firstname < b.firstname) ? 1 : ((b.firstname < a.firstname) ? -1 : 0))
      } else if (this.sortType == "lastnameasc") {
        this.currentguests.sort((a,b) => (a.lastname > b.lastname) ? 1 : ((b.lastname > a.lastname) ? -1 : 0))
      } else if (this.sortType == "lastnamedes") {
        this.currentguests.sort((a,b) => (a.lastname < b.lastname) ? 1 : ((b.lastname < a.lastname) ? -1 : 0))
      } else if (this.sortType == "emailasc") {
        this.currentguests.sort((a,b) => (a.email > b.email) ? 1 : ((b.email > a.email) ? -1 : 0))
      } else if(this.sortType == "emaildes") {
        this.currentguests.sort((a,b) => (a.email < b.email) ? 1 : ((b.email < a.email) ? -1 : 0))
      } else if (this.sortType == "phonenumberasc") {
        this.currentguests.sort((a,b) => (a.phonenumber > b.phonenumber) ? 1 : ((b.phonenumber > a.phonenumber) ? -1 : 0))
      } else if (this.sortType == "phonenumberdes") {
        this.currentguests.sort((a,b) => (a.phonenumber < b.phonenumber) ? 1 : ((b.phonenumber < a.phonenumber) ? -1 : 0))
      }
    },

    //Deletes event
    deleteGuest(firstname, lastname, email, phonenumber) {

      firebase.auth().onAuthStateChanged(user => {

        var confirm = prompt("Are you sure you want to delete the guest " + firstname + " " + lastname + "? You will NOT be able to undo this action! Type 'YES' to confirm");
        if (confirm == "YES") {
          //Gets document ID to delete it
          db.collection("users").doc(user.email).collection("events").doc(docID).collection('guests').where('firstname', '==', firstname).where('lastname', '==', lastname).where('email', '==', email).where('phonenumber', '==', phonenumber).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              db.collection("users").doc(user.email).collection("events").doc(docID).collection('guests').doc(doc.id).delete().then(() => {
                alert("The guest " + firstname + " " + lastname + " has been deleted." + doc.id);
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

<style>
#myDropdown {
  max-height: calc(5 * (1em + 8px));
}

.dropdown .search-area {
    box-sizing: border-box;
    background-position: 14px 12px;
    background-repeat: no-repeat;
    font-size: 16px;
    padding-top:5px;
    border: none;
    border-bottom: 1px solid #ddd;
}

.dropdown .search-area:focus {
    outline: 3px solid #ddd;
}

.dropdown {
    position: relative;
    display: inline-block;
    background-color: beige;
}

.dropdown-content {
  background-color: white;
  display: none;
  position: absolute;
  overflow-x: hidden;
  border: 1px solid #ddd;
  z-index: 1;
}

.dropdown-content span {
    color: black;
    padding-top:5px;
    text-decoration: none;
    display: block;
}

.dropdown span:hover {
    background-color: #ddd;
}

.show {
    display: block;
}
</style>