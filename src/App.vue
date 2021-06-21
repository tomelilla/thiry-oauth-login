<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <h4>http://localhost 可測試</h4>
    <GoogleLogin :params="googleConfig" :onSuccess="googleLogin"
      ><button>GoogleLogin</button></GoogleLogin
    >
    <br />
    <h4>https://domain 可測試</h4>
    <LineLogin :params="lineConfig" :onSuccess="lineLogin"
      ><button>LineLogin</button></LineLogin
    >
    <FacebookLogin :params="fbConfig" :onSuccess="fbLogin"
      ><button>FacebookLogin</button></FacebookLogin
    >

    <h4>loginType: {{ loginType }}</h4>
    <pre>
      {{ profile }}
    </pre>
  </div>
</template>

<script>
import GoogleLogin from "@/components/Google.vue";
import LineLogin from "@/components/Line.vue";
import FacebookLogin from "@/components/Facebook.vue";

export default {
  name: "App",
  components: {
    GoogleLogin,
    LineLogin,
    FacebookLogin
  },
  data() {
    return {
      loginType: "",
      profile: null,
      googleConfig: {
        client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID
      },
      lineConfig: {
        clientId: process.env.VUE_APP_LINE_CLIENT_ID,
        redirectUri: "https://" + window.location.host,
        clientSecret: process.env.VUE_APP_LINE_CLIENT_SECRET
      },
      fbConfig: {
        appId: process.env.VUE_APP_FACEBOOK_APP_ID,
        version: process.env.VUE_APP_FACEBOOK_VERSION
      }
    };
  },
  created() {
    console.info("👉👉 VUE_APP_FACEBOOK_APP_ID", process.env);
  },
  methods: {
    // callback
    googleLogin(res) {
      this.loginType = "google";
      this.profile = res;
      console.info("👉👉 googleLogin res", res);
    },
    lineLogin(res) {
      this.loginType = "line";
      this.profile = res;
      console.info("👉👉 lineLogin res", res);
    },
    fbLogin(res) {
      this.loginType = "facebook";
      this.profile = res;
      console.info("👉👉 fbLogin res", res);
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
