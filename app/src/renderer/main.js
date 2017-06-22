import 'highlight.js/styles/darcula.css';
import Vue from 'vue';
import Electron from 'vue-electron';
import VueMaterial from 'vue-material';
import VueHighlightJS from 'vue-highlightjs';
import 'vue-material/dist/vue-material.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import App from './App';
import ClipboardHistory from './components/ClipboardHistory';
import Toolbar from './components/Toolbar';
import HistoryItem from './components/HistoryItem';
import Snackbar from './components/Snackbar';
import {} from 'electron';

Vue.use(Electron);
Vue.use(VueMaterial);
Vue.use(require('vue-moment'));
Vue.use(VueHighlightJS);

Vue.component('clipboard-history', ClipboardHistory);
Vue.component('toolbar', Toolbar);
Vue.component('history-item', HistoryItem);
Vue.component('snackbar', Snackbar);

Vue.material.registerTheme('default', {
  primary: {
    color: 'grey',
    hue: 800,
  },
  accent: 'pink',
  warn: 'orange',
  background: 'grey',
});

Vue.config.debug = true;

// eslint-disable-next-line no-new
new Vue({
  ...App,
}).$mount('#app');
