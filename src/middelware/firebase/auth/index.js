import { app } from "../../../boot/firebase";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, onValue } from "firebase/database";
const auth = getAuth()
const db = getDatabase();

function createUserWithEmailAndPasswordInFirebase(email, password, name) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const userId = userCredential.user.uid;
            set(ref(db, 'users/' + userId), {
                name: name,
                email: email,
                online: true
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("errorCode:", errorCode, "errorMessage", errorMessage);
        });
}
function signInWithEmailAndPasswordInFirebase(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const userId = userCredential.user.uid;
            console.log(`${userId} is login`);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("errorCode:", errorCode, "errorMessage", errorMessage);
        });
}


export {
    createUserWithEmailAndPasswordInFirebase,
    signInWithEmailAndPasswordInFirebase,
}