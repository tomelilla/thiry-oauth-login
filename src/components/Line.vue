<template>
  <div @click="login">
    <slot></slot>
  </div>
</template>

<script>
import axios from "axios";
import qs from "qs";

export default {
  name: "LineLogin",
  props: {
    params: {
      type: Object,
      required: true
    },
    onSuccess: {
      type: Function,
      default: () => {}
    },
    onSuccessout: {
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
        scope: "profile email openid"
        // scope: "profile%20openid%20email"
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
      const response = await this.request({
        url,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        Accept: "application/json, text/plain, */*",
        data: qs.stringify(data)
      });
      if (response.error) {
        return this.onSuccess(response);
      }
      console.info("👉👉 response", response);
      // const profile = await this.getProfile(response);
      const user = await this.getUser(response);
      console.info("👉👉 user", user);
      this.onSuccess({
        loginStatus: response,
        userProfile: user
      });
    },
    getProfile(params) {
      if (this.isLocalhost) {
        console.warn("👉👉 line login need https public url");
        return;
      }
      const url = this.LINE_API + "/v2/profile";
      return this.request({
        url,
        method: "GET",
        headers: {
          authorization: `${params.token_type} ${params.access_token}`
        },
        Accept: "application/json, text/plain, */*"
      });
    },
    getUser(params) {
      if (this.isLocalhost) {
        console.warn("👉👉 line login need https public url");
        return;
      }
      const url = this.LINE_API + "/oauth2/v2.1/verify";
      const post = {
        id_token: params.id_token,
        client_id: this.params.clientId
      };
      return this.request({
        url,
        method: "POST",
        // headers: {
        //   authorization: `${params.token_type} ${params.id_token}`
        // },
        data: qs.stringify(post),
        Accept: "application/json, text/plain, */*"
      });
    }
  }
};
</script>
