import { createUserWithEmailAndPasswordInFirebase, signInWithEmailAndPasswordInFirebase } from "../middelware/firebase/auth"
import { app } from "boot/firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, update, onChildAdded, onChildChanged, get, set, push, off } from "firebase/database";
import Vue from 'vue';
const auth = getAuth()
const db = getDatabase();


const state = {
    userDetails: {},
    users: {},
    messages: {},
}
const mutations = {
    setUserDetails(state, payload) {
        state.userDetails = payload
    },
    addUser(state, payload) {
        Vue.set(state.users, payload.uid, payload.userDetails)
    },
    updateUser(state, payload) {
        Object.assign(state.users[payload.uid], payload.userDetails)
    },
    addMessage(state, payload) {
        Vue.set(state.messages, payload.messageId, payload.messageDetails)
    },
    clearMessages(state) {
        state.messages = {}
    }


}
const actions = {
    registerUser({ }, payload) {
        createUserWithEmailAndPasswordInFirebase(payload.email, payload.password, payload.name)
    },
    loginUser({ }, payload) {
        signInWithEmailAndPasswordInFirebase(payload.email, payload.password)
    },
    logoutUser({ }) {
        signOut(auth).then(() => {
            console.log('Sign-out successful.');
        }).catch((error) => {
            console.log('An error happened.');
        });
    },
    handleAuthStateChanged({ commit, dispatch, state }) {
        console.log('handleAuthStateChanged');
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid;
                get(ref(db, 'users/' + uid)).then((snapshot) => {
                    const snapshotValue = snapshot.val();
                    const data = {
                        uid: uid,
                        name: snapshotValue.name,
                        email: snapshotValue.email,
                    }
                    console.log(data);
                    commit("setUserDetails", data)
                    console.log("setUserDetails", data);
                })
                const payload = {
                    uid: uid,
                    updates: { online: true }
                };
                dispatch('firebaseUpdateUser', payload)
                dispatch('firebaseGetUsers')
                this.$router.push('/')
            } else {
                // User is signed out
                const payload = {
                    uid: state.userDetails.uid,
                    updates: { online: false }
                };
                dispatch('firebaseUpdateUser', payload)
                commit("setUserDetails", {})
                console.log("setUserDetails", {});
                this.$router.push('/auth')
            }
        })
    },
    firebaseUpdateUser({ }, payload) {
        if (payload.uid) {
            update(ref(db, 'users/' + payload.uid), payload.updates)
        }
    },
    firebaseGetUsers({ commit }) {
        onChildAdded(ref(db, 'users/'), (snapshot) => {
            const uid = snapshot.key
            const userDetails = snapshot.val()
            commit('addUser', { uid, userDetails })
        });
        onChildChanged(ref(db, 'users/'), (snapshot) => {
            const uid = snapshot.key
            const userDetails = snapshot.val()
            commit('updateUser', { uid, userDetails })
        });
    },
    firebaseGetMessages({ state, commit }, otherUserId) {
        console.log('uid', state.userDetails.uid);
        console.log('otherUserId', otherUserId);
        onChildAdded(ref(db, 'chats/' + state.userDetails.uid + '/' + otherUserId), (snapshot) => {
            const messageId = snapshot.key
            const messageDetails = snapshot.val()
            console.log('messageId:', messageId, 'messageDetails:', messageDetails);
            commit('addMessage', { messageId, messageDetails })
        });
    },
    firebaseStopGetMessages({ commit }, otherUserId) {
        console.log("firebaseStopGetMessages-otherUserId", otherUserId);
        off(ref(db, 'chats/' + state.userDetails.uid + '/' + otherUserId), 'child_added')
        commit('clearMessages')

    },
    firebaseSendMessage({ state }, payload) {
        push(ref(db, 'chats/' + state.userDetails.uid + '/' + payload.otherUserId), payload.message);
        payload.message.from = 'them';
        push(ref(db, 'chats/' + payload.otherUserId + '/' + state.userDetails.uid), payload.message);
    },
}
const getters = {
    users: state => {
        let usersFiltered = {}
        Object.keys(state.users).forEach(key => {
            if (key !== state.userDetails.uid) {
                usersFiltered[key] = state.users[key]
            }
        })
        return usersFiltered
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
