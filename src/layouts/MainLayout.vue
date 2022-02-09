<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          v-if="$route.fullPath.includes('/chat')"
          v-go-back.single
          icon="arrow_back"
          flat
          dense
          label="Back"
        />
        <q-toolbar-title class="absolute-center">
          {{ title }}
        </q-toolbar-title>
        <q-btn
          v-if="!userDetails.uid"
          to="/auth"
          icon="account_circle"
          class="q-pr-sm absolute-right"
          label="Login"
          no-caps
          flat
          dense
        />
        <q-btn
          v-else
          @click="logoutUser"
          icon="account_circle"
          class="q-pr-sm absolute-right"
          no-caps
          flat
          dense
        >
          Logout <br />
          {{ userDetails.name }}
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState, mapActions } from "vuex";
import mixinOtherUserDetails from "src/mixins/mixin-otherUserDetails";

export default {
  name: "MainLayout",
  mixins: [mixinOtherUserDetails],
  data() {
    return {};
  },
  computed: {
    ...mapState("store", ["userDetails"]),
    title() {
      let currectPath = this.$route.fullPath;
      if (currectPath == "/") return "MyChat";
      else if (currectPath.includes("/chat"))  return this.otherUserDetails.name;
      else if (currectPath == "/auth") return "Login";
    },
  },
  methods: {
    ...mapActions("store", ["logoutUser"]),
  },
};
</script>
<style lang="stylus">
.q-toolbar {
  .q-btn {
    line-height: 1.2;
  }
}
</style>
