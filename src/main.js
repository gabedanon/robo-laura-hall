// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import store from './store'

import VueLocalForage from 'vue-localforage'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import fontawesome from '@fortawesome/fontawesome'

import faGithub from '@fortawesome/fontawesome-free-brands/faGithub'

Vue.use(VueLocalForage)
Vue.use(Vuetify)
Vue.component('font-awesome-icon', FontAwesomeIcon)

fontawesome.library.add(faGithub)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>',
  mounted () {
    this.$store.dispatch('setVoices')
  }
})
