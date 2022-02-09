<template>
  <q-page class="flex q-pa-md">
    <q-card class="full-width">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="Login" label="Login" />
        <q-tab name="Register" label="Register" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="Login">
          <LoginRegister :tab="tab"/>
        </q-tab-panel>

        <q-tab-panel name="Register">
          <LoginRegister :tab="tab"/>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import LoginRegister from "../components/LoginRegister.vue";
export default {
  name: "PageAuth",
  components: {
    LoginRegister,
  },
  data() {
    return {
      tab: "Login",
    };
  },
};
</script>
