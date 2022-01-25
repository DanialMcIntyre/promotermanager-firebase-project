<template>
  <div>
    <h1>Create new guest</h1>
    <form id="newguest">
      First Name <input type="text" placeholder="First Name" id="guestname" required/> <br/>
      Last Name <input type="text" placeholder="Last Name" id="guestlastname" required/> <br/>
      Email <input type="email" placeholder="Email" id="guestemail" required/> <br/>
      Phone Number <input type="number" placeholder="Phone Number" id="guestphone" required/> <br/>
      <button @click="submit" type="button">Add guest</button>
    </form>
    <p><router-link to="/guests">Back</router-link></p>
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
        } else if (!user.emailVerified) {
          router.replace('verifyaccount')
        } else if (route.path == "/login" || route.path == "/register") {
          router.replace('/');
        }
      });
    });

  },
  data() {
    return {
      firstname: '',
      lastname: '',
      email: '',
      phonenumber: '',
      guests: []
    }
  },
  created() {
    //Puts all current events in array
    firebase.auth().onAuthStateChanged(user => {
      db.collection("users").doc(user.email).collection('guests').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
          //Puts data into guest object
          this.guests.push(doc.data())
        });
      });
      
    });
  },

  methods: {

    submit() {

      //Creates guest object and puts values into it
      const guest = {
        firstname: document.getElementById("guestname").value,
        lastname: document.getElementById("guestlastname").value,
        email: document.getElementById("guestemail").value,
        phonenumber: document.getElementById("guestphone").value
      }

      //Checks if all fields have values
      if (guest.firstname != '' && guest.lastname != '' && guest.email != '' && guest.phonenumber != '') {
        var guestExists = false;

        //Checks if guest with the same name fields already exists
        for (const element of this.guests) {
          if(element.firstname == guest.firstname && element.lastname == guest.lastname && element.email == guest.email && element.phonenumber == guest.phonenumber) {
            guestExists = true;
            alert("A guest with these fields already exists.")
          }
        }

        if(guestExists == false) {
          const user = firebase.auth().currentUser;

          db.collection('users').doc(user.email).collection('guests').add(guest);
          alert(guest.firstname + " " + guest.lastname + " has been added!")
          document.getElementById("newguest").reset();
        }


      } else {
        alert("Please fill out the form!")
      }
    }
  }
}

</script>
