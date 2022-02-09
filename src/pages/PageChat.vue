<template>
  <q-page class="page-chat flex column" ref="pageChat">
    <q-banner v-if="!otherUserDetails.online" class="bg-grey-4 text-center fixed-top">
      {{ otherUserDetails.name }} is offline
    </q-banner>
    <div
      class="q-pa-md column col justify-end"
      :class="{ invisible: !showMessages }"
    >
      <q-chat-message
        v-for="(message, key) in messages"
        :key="key"
        :text="[message.text]"
        :name="message.from == 'me' ? userDetails.name : otherUserDetails.name"
        :sent="message.from == 'me' ? true : false"
        :bg-color="message.from == 'me' ? 'white' : 'blue-3'"
      />
    </div>
    <q-footer elevated>
      <q-toolbar>
        <q-form @submit="sendMessage()" class="full-width">
          <q-input
            v-model="newMessage"
            ref="newMessage"
            label="Message"
            bg-color="white"
            rounded
            outlined
            dense
          >
            <template v-slot:after>
              <q-btn
                round
                dense
                flat
                color="white"
                icon="send"
                @click="sendMessage()"
              />
            </template>
          </q-input>
        </q-form>
      </q-toolbar>
    </q-footer>
  </q-page>
</template>

<script>
import { mapState, mapActions } from "vuex";
import mixinOtherUserDetails from "src/mixins/mixin-otherUserDetails";
export default {
  name: "PageChat",
  mixins: [mixinOtherUserDetails],
  data() {
    return {
      newMessage: "",
      otherUserId: this.$route.params.otherUserId,
      showMessages: false,
    };
  },
  computed: {
    ...mapState("store", ["messages", "userDetails"]),
  },
  methods: {
    ...mapActions("store", [
      "firebaseGetMessages",
      "firebaseStopGetMessages",
      "firebaseSendMessage",
    ]),
    sendMessage() {
      this.firebaseSendMessage({
        message: {
          text: this.newMessage,
          from: "me",
        },
        otherUserId: this.otherUserId,
      });
      this.cleanMessage();
    },
    cleanMessage() {
      this.newMessage = "";
      this.$refs.newMessage.focus();
    },
    scrollToBottom() {
      let pageChat = this.$refs.pageChat.$el;
      setTimeout(() => {
        window.scrollTo(0, pageChat.scrollHeight);
      }, 20);
    },
  },
  watch: {
    messages: function (val) {
      if (Object.keys(val).length) {
        this.scrollToBottom();
        setTimeout(() => {
          this.showMessages = true;
        }, 200);
      }
    },
  },
  mounted() {
    this.firebaseGetMessages(this.$route.params.otherUserId);
  },
  destroyed() {
    this.firebaseStopGetMessages(this.otherUserId);
  },
};
</script>
<style lang="stylus">
  .page-chat
    background #e2dfd5
    &:after
      content ''
      display block
      position fixed
      left 0
      right 0
      top 0
      bottom 0
      z-index 0
      opacity 0.1

      background-image radial-gradient(closest-side, transparent 98%, rgba(0,0,0,.3) 99%),radial-gradient(closest-side, transparent 98%, rgba(0,0,0,.3) 99%);
      background-size 80px 80px;
      background-position 0 0, 40px 40px;
  .q-banner
    top 50px
    z-index 2
    opacity 0.8
  .q-message
    z-index 1
</style>
