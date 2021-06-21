<template>
  <div @click="login">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "FackbookLogin",
  props: {
    params: {
      type: Object,
      required: true
    },
    onSuccess: {
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
      options: {
        cookie: true,
        xfbml: true
      },
      sdk: null,
      userID: null,
      loginStatus: null
    };
  },
  computed: {
    // isConnent
    accessToken() {
      return this.loginStatus?.authResponse?.accessToken;
    },
    config() {
      return {
        ...this.options,
        ...this.params
      };
    }
  },
  async created() {
    this.initSdk().then(async () => {
      this.loginStatus = await this.getLoginStatus();
      this.userProfile = await this.getUserProfile();
    });
  },
  methods: {
    initSdk() {
      // 防止重複載入
      const config = this.config;

      return new Promise(resolve => {
        if (!window.FB) {
          window.fbAsyncInit = function() {
            window.FB.init(config);
            window.FB.AppEvents.logPageView();
          };

          (function(d, s, id) {
            let js;
            const fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
              return;
            }
            // eslint-disable-next-line prefer-const
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
          })(document, "script", "facebook-jssdk");
        }
        resolve(window.FB);
      });
    },
    async getUserProfile() {
      const userProfile = await new Promise(resolve => {
        window.FB.api(
          "/me",
          { fields: "id,name,email,picture,birthday,gender" },
          response => {
            resolve(response);
          }
        );
      });
      const loginStatus = await this.getLoginStatus();
      this.onSuccess({ loginStatus, userProfile });
    },
    getLoginStatus() {
      return new Promise(resolve => window.FB?.getLoginStatus(resolve));
    },
    async login(options) {
      await new Promise(resolve => window.FB?.login(resolve, options));
      await this.getUserProfile();
    },
    logout() {
      return new Promise(resolve => window.FB?.logout(resolve));
    }
  }
};
</script>
