import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCJxC_-gZBWDegwAxQqc_Ikaj1CBUjqns4",
  authDomain: "fir-promotermanager.firebaseapp.com",
  projectId: "fir-promotermanager",
  storageBucket: "fir-promotermanager.appspot.com",
  messagingSenderId: "22000139722",
  appId: "1:22000139722:web:4ae5c0d4593ac982ac6333"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

createApp(App).use(router).mount('#app')
