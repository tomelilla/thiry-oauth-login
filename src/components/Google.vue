<template>
  <div>
    <GoogleLogin :params="params" :onSuccess="onSuccess" :onFailure="onFailure">
      <slot></slot>
    </GoogleLogin>
  </div>
</template>

<script>
import GoogleLogin from "vue-google-login";

export default {
  name: "GoogleLogin",
  props: {
    params: {
      type: Object,
      required: true
    },
    onLogin: {
      type: Function,
      default: () => {}
    },
    onLoginout: {
      type: Function,
      default: () => {}
    }
  },
  components: {
    GoogleLogin
  },
  data() {
    return {
      renderParams: {
        width: 250,
        height: 50,
        longtitle: true
      }
    };
  },
  methods: {
    onSuccess(googleUser) {
      console.log(googleUser);

      // This only gets the user information: id, name, imageUrl and email
      console.log(googleUser.getBasicProfile());
      this.onLogin(googleUser.getBasicProfile());
    },
    onFailure(res) {
      console.info("👉👉 res", res);
    }
  }
};
</script>
