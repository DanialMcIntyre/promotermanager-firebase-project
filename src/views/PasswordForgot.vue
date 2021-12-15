<template>
  <div class="register">
      <h1>Forgot Password</h1>
        <form @submit.prevent>
        <div>
          <label for="email">Email: </label>
          <input type="email" placeholder="joe@bloggs.com" v-model="email" id="email" required/>
        </div>
        <br/>
        <div>
          <button type="submit" @click="sendEmail">
            <transition name="fade" mode="out-in">
              <span v-if="!emailSending">Send</span>
              <span v-else>Sending...</span>
            </transition>
          </button>
        </div>
      </form>
      <p><router-link to="/login">Log in</router-link></p>
  </div>
</template>

<script>
import firebase from 'firebase';
import {useRouter} from 'vue-router';
import {onBeforeMount} from 'vue';

export default {

  setup() {

    //Send user back to home if already logged in
    const router = useRouter();
    onBeforeMount(() =>  {
      firebase.auth().onAuthStateChanged((user) => {
        if(user) {
          router.replace('/');
        }
      });
    });

  },

  data() {
    return {
      email: "",
      error: null,
      emailSending: false,
    };
  },
  
  methods: {

    sendEmail() {
      if (!this.email) {
        this.error = "Please type in a valid email address.";
        return;
      }
      this.error = null;
      this.emailSending = true;
      firebase
        .auth()
        .sendPasswordResetEmail(this.email)
        .then(() => {
          this.emailSending = false;
        })
        .catch((error) => {
          alert(error);
        });
    }
  }
}

</script>