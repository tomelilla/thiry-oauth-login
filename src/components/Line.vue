<template>
  <div @click="login">
    <slot></slot>
  </div>
</template>

<script>
import axios from "axios";
import qs from "qs";

export default {
  name: "line-login",
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
  data() {
    return {
      LINE_AUTH: "https://access.line.me",
      LINE_API: "https://api.line.me",
      ACCESS_TOKEN: ""
    };
  },
  computed: {
    isLocalhost: () => window.location.host.indexOf("localhost") > -1,
    config() {
      return {
        response_type: "code",
        client_id: this.params.clientId,
        redirect_uri: this.params.redirectUri,
        state: "howgroup",
        scope: "profile openid email"
      };
    }
  },
  created() {
    const query = new URLSearchParams(window.location.search.substring(1));
    const code = query.get("code");
    if (code ?? "" !== "") {
      this.getAssssToken(code);
    }
  },
  methods: {
    login() {
      if (this.isLocalhost) {
        console.warn("👉👉 line login need https public url");
        return;
      }
      const url = this.LINE_AUTH + "/oauth2/v2.1/authorize";

      const searchParams = new URLSearchParams(this.config);
      window.location.href = `${url}?${searchParams.toString()}`;
    },
    request(options = {}) {
      return axios(options)
        .then(response => response.data)
        .catch(err => err.response.data);
    },
    async getAssssToken(code) {
      if (this.isLocalhost) {
        console.warn("👉👉 line login need https public url");
        return;
      }
      const url = this.LINE_API + "/oauth2/v2.1/token";
      const data = {
        grant_type: "authorization_code",
        code,
        redirect_uri: this.params.redirectUri,
        client_id: this.params.clientId,
        client_secret: this.params.clientSecret
      };
      return this.request({
        url,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        Accept: "application/json, text/plain, */*",
        data: qs.stringify(data)
      }).then(response => {
        if (response.error) {
          return this.onLogin(response);
        }
        return this.getProfile(response);
      });
    },
    getProfile(params) {
      if (this.isLocalhost) {
        console.warn("👉👉 line login need https public url");
        return;
      }
      const url = this.LINE_API + "/v2/profile";
      this.request({
        url,
        method: "GET",
        headers: {
          authorization: `${params.token_type} ${params.access_token}`
        },
        Accept: "application/json, text/plain, */*"
      }).then(response => {
        this.onLogin(response);
      });
    }
  }
};
</script>
