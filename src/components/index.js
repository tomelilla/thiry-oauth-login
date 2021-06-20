// src/components/index.js
import GoogleLogin from "./Google.vue";
import LineLogin from "./Line.vue";
import FacebookLogin from "./Facebook.vue";

const Components = [GoogleLogin, LineLogin, FacebookLogin];

const install = function(Vue) {
  Components.forEach(component => {
    Vue.component(component.name, component);
  });
};
export default {
  install
};
