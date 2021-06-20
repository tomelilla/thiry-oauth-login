// src/components/index.js
import GoogleLogin from "./Google.vue";
import LineLogin from "./Line.vue";
import FacebookLogin from "./Facebook.vue";

export default GoogleLogin;
export { GoogleLogin, LineLogin, FacebookLogin };

// const Components = [GoogleLogin, LineLogin, FacebookLogin];
// const install = function(Vue, options = {}) {
//   Components.forEach(component => {
//     Vue.component(component.name, component);
//   });
// };
// export default { install };
