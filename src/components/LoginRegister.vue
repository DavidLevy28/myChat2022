<template>
  <q-form @submit="submitForm">
    <q-input
      v-if="tab == 'Register'"
      v-model="formData.name"
      class="q-mb-md"
      outlined
      label="Name"
    />
    <q-input
      v-model="formData.email"
      class="q-mb-md"
      type="email"
      outlined
      label="Email"
    />
    <q-input
      v-model="formData.password"
      class="q-mb-md"
      type="password"
      outlined
      label="Password"
    />
    <div class="row">
      <q-space />
      <q-btn type="submit" color="primary" :label="tab" />
    </div>
  </q-form>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "LoginRegister.vue",
  props: ["tab"],
  data() {
    return {
      formData: {
        name: "",
        email: "",
        password: "",
      },
    };
  },
  methods: {
    ...mapActions("store", ["registerUser", "loginUser"]),
    submitForm() {
      if (this.tab == "Login") {
        console.log("login the user");
        this.loginUser(this.formData);
      } else {
        console.log("regiister the user");
        this.registerUser(this.formData);
      }
    },
  },
};
</script>
