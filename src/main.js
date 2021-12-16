import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import firebase from "firebase"
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCJxC_-gZBWDegwAxQqc_Ikaj1CBUjqns4",
  authDomain: "fir-promotermanager.firebaseapp.com",
  projectId: "fir-promotermanager",
  storageBucket: "fir-promotermanager.appspot.com",
  messagingSenderId: "22000139722",
  appId: "1:22000139722:web:4ae5c0d4593ac982ac6333",
  databaseURL: "https://fir-promotermanager-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
db.settings({timestampsInSnapshots: true});
export default db;

createApp(App).use(router).mount('#app')
