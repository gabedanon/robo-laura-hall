<template>
  <v-container fluid>
    <div v-if="roboLauraHallVoice">
      <v-layout row wrap>
        <v-flex xs12 lg8 offset-lg2>
          <v-card>
            <v-card flat :style="{ position: 'sticky', top: '56px', zIndex: '1' }">
              <v-card-text>
                <v-layout align-end row spacer>
                  <div class="rlhIcon indigo darken-3">
                    <img src="../assets/robo-laura-hall.svg">
                  </div>
                  <v-text-field
                    v-model="text"
                    label="Robo Laura Hall says..."
                    @keyup.enter="speak()"
                    :disabled="speaking"
                    class="rlhRow"
                  />
                  <v-btn @click.stop="text = ''" icon ripple>
                    <v-icon color="grey lighten-1">close</v-icon>
                  </v-btn>
                </v-layout>
              </v-card-text>
              <v-divider />
            </v-card>
            <v-list dense two-line subheader>
              <v-list-tile :disabled="speaking" avatar @click="speak(timestamp())">
                <v-list-tile-avatar>
                  <v-icon class="amber white--text">av_timer</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>Timestamp</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-subheader v-if="catchphrases && catchphrases.length">Catchphrases</v-subheader>
              <v-divider v-if="catchphrases && catchphrases.length"></v-divider>
              <draggable v-model="catchphrases" @end="updateCatchphrases">
                <v-list-tile :disabled="speaking" v-for="catchphrase in catchphrases" :key="catchphrase" avatar @click="speak(catchphrase)" v-if="catchphrases && catchphrases.length">
                  <v-list-tile-avatar>
                    <v-icon class="blue white--text">chat_bubble</v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ catchphrase }}</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-btn @click.stop="destroyCatchphrase(catchphrase)" icon ripple>
                      <v-icon color="grey lighten-1">close</v-icon>
                    </v-btn>
                  </v-list-tile-action>
                </v-list-tile>
              </draggable>
            </v-list>
          </v-card>
        </v-flex>
        <v-dialog v-model="addingUtterance" max-width="290">
          <v-card>
            <v-card-title class="headline">Add a New {{ newUtterance.type }}</v-card-title>
            <v-card-text>
              <v-text-field
                multi-line
                label="Text"
                v-model="newUtterance.text" />
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" flat="flat" @click.native="cancelEdit">Cancel</v-btn>
              <v-btn color="green darken-1" flat="flat" @click.native="saveUtterance">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </div>
    <v-fab-transition>
      <v-tooltip right>
        <v-btn
          slot="activator"
          :color="speaking ? 'amber' : 'blue'"
          dark
          fab
          large
          bottom
          left
          fixed
          v-show="thereIsText || speaking"
          @click.stop="speaking ? cancelSpeak() : speak()">
          <v-icon>{{ speaking ? 'speaker_notes_off' : 'speaker_notes' }}</v-icon>
        </v-btn>
        <span>{{ speaking ? 'Stop Speaking' : 'Speak' }}</span>
      </v-tooltip>
    </v-fab-transition>      
    <v-tooltip left>
      <v-btn
        slot="activator"
        fab
        dark
        large
        bottom
        right
        fixed
        color="pink"
        @click.stop="addUtterance('Catchphrase')">
        <v-icon>add</v-icon>
      </v-btn>
      <span>Add Catchphrase</span>
    </v-tooltip>
  </v-container>
</template>

<script>
import moment from 'moment'
import draggable from 'vuedraggable'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'RoboLauraHall',
  data: () => ({
    catchphrases: [],
    trends: [],
    questions: [],
    plugs: [],
    utterance: new SpeechSynthesisUtterance(),
    fab: true,
    text: '',
    thereIsText: false,
    speaking: false,
    scrolled: false,
    speedDialOpen: false,
    newUtterance: {
      type: 'Trend',
      text: ''
    },
    addingUtterance: false,
    utteranceTypes: [
      'Trend',
      'Question',
      'Catchphrase'
    ],
    defaultCatchphrases: [
      'Hello my name is Robo Laura Hall',
      `I'm Horny`,
      'Please give me smooches',
      'Please update my software',
      'I love you',
      `I don't love you anymore`,
      `I don't like you`,
      'Yes',
      'No',
      'No Way',
      'Will you commit to me... on Github?',
      'Chappie is my Cousin',
      `Y'all ready to Hoe-Down?`,
      'Byyeeeeeeeeeee'
    ]
  }),
  beforeDestroy () {
    this.cancelSpeak()
  },
  methods: {
    setupVoice (val) {
      const vm = this
      let interval
      vm.utterance.voice = val
      vm.utterance.onstart = () => {
        console.log('started')
        vm.speaking = true
        interval = setInterval(() => {
          if (!vm.synth.speaking) {
            console.log('ended')
            vm.speaking = false
            clearInterval(interval)
          } else {
            console.log('resumed')
            vm.synth.resume()
          }
        }, 14000)
      }
      vm.utterance.onend = () => {
        console.log('ended')
        vm.speaking = false
        clearInterval(interval)
      }
    },
    cancelSpeak () {
      this.synth.cancel()
    },
    speak (val) {
      const vm = this
      if (!vm.speaking) {
        if (val || val === '') {
          vm.utterance.text = val
          vm.text = val
        }
        process.nextTick(() => {
          if (vm.text) vm.synth.speak(vm.utterance)
        })
      }
    },
    timestamp () {
      return moment().format('[The time is] dddd, MMMM Do, YYYY, [at] h:mm a, [and] s [seconds]')
    },
    setCatchphrases (payload) {
      this.catchphrases = payload
    },
    setDefaultCatchphrases () {
      this.$setItem('catchphrases', this.defaultCatchphrases, (err, value) => {
        if (err) console.error(err.stack)
        this.catchphrases = this.defaultCatchphrases
        console.log(value)
      })
    },
    saveCatchphrase () {
      if (this.newUtterance.text && this.catchphrases.indexOf(this.newUtterance.text) < 0) {
        this.catchphrases.push(this.newUtterance.text)
        this.updateCatchphrases()
      }
    },
    destroyCatchphrase (catchphrase) {
      if (window.confirm('Are you sure?')) {
        let index = this.catchphrases.indexOf(catchphrase)
        this.catchphrases.splice(index, 1)
        this.updateCatchphrases()
      }
    },
    updateCatchphrases () {
      const vm = this
      process.nextTick(() => {
        vm.$setItem('catchphrases', vm.catchphrases, (err, value) => {
          if (err) console.error(err.stack)
          console.log(value)
        })
      })
    },
    saveUtterance () {
      this.saveCatchphrase()
      process.nextTick(() => {
        this.cancelEdit()
      })
    },
    addUtterance (type = 'Catchphrase') {
      this.newUtterance.type = type
      this.addingUtterance = true
    },
    cancelEdit () {
      const vm = this
      vm.newUtterance.text = ''
      vm.addingUtterance = false
    }
  },
  computed: {
    ...mapState([
      'synth'
    ]),
    ...mapGetters([
      'roboLauraHallVoice'
    ])
  },
  mounted () {
    const vm = this
    vm.cancelSpeak()
    vm.$getItem('catchphrases', (err, value) => {
      if (err) console.error(err.stack)
      if (value) {
        vm.setCatchphrases(value)
      } else {
        vm.setDefaultCatchphrases()
      }
    })
    if (vm.roboLauraHallVoice) vm.setupVoice(vm.roboLauraHallVoice)
  },
  watch: {
    roboLauraHallVoice (val) {
      this.setupVoice(val)
    },
    text (val) {
      this.utterance.text = val
      this.thereIsText = !!val
    }
  },
  components: {
    draggable
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.rlhIcon {
  width: 60px;
  height: 60px;
  padding: 5px 10px;
  margin-right: 18px;
}

.rlhIcon img {
  width: 40px;
  height: auto;
}

.rlhRow {
  margin-bottom: -25px;
}


</style>
