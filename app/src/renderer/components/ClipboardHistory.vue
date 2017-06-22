<template>
    <div class="scroll-area">
        <md-list class="md-double-line md-dense">
            <div v-for="item in history">
                <history-item :historyItem="item" :now="now"></history-item>
                <md-divider class="m-accent"></md-divider>
            </div>
        </md-list>
    </div>
</template>

<script>
  import { ipcRenderer } from 'electron';
  import moment from 'moment';

  export default {
    data() {
      return {
        history: [],
        now: moment().toDate(),
        interval: null,
      };
    },
    created() {
      ipcRenderer.on('history-changed', (event, history) => {
        this.historyChanged(history);
      });
      ipcRenderer.send('clipboard-history-created');
      this.interval = setInterval(() => {
        this.now = moment().toDate();
      }, 1000);
    },
    methods: {
      historyChanged(newHist) {
        this.history = newHist;
      },
    },
  };
</script>

<style scoped>
    .scroll-area {
        overflow: auto;
    }
</style>
