import firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyCSR1DCzjr2iCorsz8vhkrRTMj3cM2uFqY",
  authDomain: "slack-clone-f9321.firebaseapp.com",
  projectId: "slack-clone-f9321",
  storageBucket: "slack-clone-f9321.appspot.com",
  messagingSenderId: "252007812153",
  appId: "1:252007812153:web:aa151f44740ebdb52bd1e8",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const Auth = firebase.auth();
var provider = new firebase.auth.GoogleAuthProvider();
const authHandler = (checkHandler) => {
  switch (checkHandler.type) {
    case "signup":
      return new Promise((resolve, reject) => {
        Auth.createUserWithEmailAndPassword(
          checkHandler.email,
          checkHandler.password
        )
          .then((user) => {
            resolve(user);
          })
          .catch((err) => {
            reject(err);
          });
      });
    case "login":
      return new Promise((resolve, reject) => {
        Auth.signInWithEmailAndPassword(
          checkHandler.email,
          checkHandler.password
        )
          .then((user) => {
            resolve(user);
          })
          .catch((err) => {
            reject(err);
          });
      });
    case "google":
      return new Promise((resolve, reject) => {
        Auth.signInWithPopup(provider)
          .then((user) => {
            resolve(user);
          })
          .catch((err) => {
            reject(err);
          });
      });
    default:
      console.log("<<<<< Chhose correct option >>>>");
  }
};
// const authState = () => {
//   return new Promise((resolve, reject) => {    // after satistfied it will not going to work 
//     firebase.auth().onAuthStateChanged(function (user) {
//       if (user) {
//         // User is signed in.
// console.log("LOGG",user);
// resolve(user);
// } else {
//         console.log("OUT",user);
//         // No user is signed in.
//         reject(user);
//       }
//     });
//   });
// };

export default authHandler;
export { db , Auth };
