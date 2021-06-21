<template>
  <div @click="handleClick" :id="id">
    <slot></slot>
  </div>
</template>

<script>
// <GoogleLogin :params="params" :onSuccess="onSuccess" :onFailure="onFailure">Login</GoogleLogin>
let componentId = 0;
import GoogleAuth from "./GoogleAuth";

export default {
  name: "GoogleLogin",
  props: {
    params: {
      type: Object,
      required: true
    },
    /* offline: {
			type: Boolean,
			default: false
		}, */
    onCurrentUser: {
      type: Function,
      default: () => {}
    },
    onSuccess: {
      type: Function,
      default: () => {}
    },
    onFailure: {
      type: Function,
      default: () => {}
    },
    logoutButton: {
      type: Boolean,
      default: false
    },
    renderParams: {
      type: Object,
      required: false
    }
  },
  beforeCreate() {
    this.id = `google-signin-btn-${componentId++}`;
  },
  methods: {
    handleClick() {
      /* if (this.offline) {
				GoogleAuth['grantOfflineAccess']({ 'redirect_uri': 'postmessage' }).then(result => {
					return this.onSuccess(result);
				}).catch(err => {
					return this.onFailure(err);
				});
			} else {
			} */
      const method = this.logoutButton ? "signOut" : "signIn";
      GoogleAuth[method]()
        .then(result => {
          // console.info("👉👉 result", result);
          const { dt: userProfile, mc: loginStatus } = result;
          return this.onSuccess({ userProfile, loginStatus });
        })
        .catch(err => {
          return this.onFailure(err);
        });
    }
  },
  mounted() {
    GoogleAuth.load(this.params)
      .then(() => {
        if (this.renderParams && this.logoutButton === false) {
          window.gapi.signin2.render(this.id, this.renderParams);
        }
        if (GoogleAuth.isSignedIn()) {
          this.onCurrentUser(GoogleAuth.currentUser());
        }
      })
      .catch(err => {
        // console.log("GoogleAuth", err);
        this.onFailure(err);
        // return err.response.data;
      });
  }
};
</script>

<style></style>
