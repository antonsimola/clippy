<template>
    <div class="scroll-area">
        <md-list class="md-double-line md-dense">
            <div v-for="item in history">
                <md-list-item >
                    <div class="md-list-text-container">
                <span>
                    {{item.text}}
                </span>
                        <span>{{item.time | moment("from", now)}}</span>
                    </div>
                    <md-button class="md-icon-button md-list-action" @click.native="onItemCopy(item)">
                        <md-icon>content_copy</md-icon>
                    </md-button>
                </md-list-item>
                <md-divider class="m-accent"></md-divider>
            </div>
        </md-list>
        <md-snackbar md-position="bottom center" ref="snackbar" md-duration="2000">
            <span>Copied to clipboard</span>
        </md-snackbar>
    </div>
</template>

<script>
  import { ipcRenderer } from 'electron';
  export default {
    data() {
      return {
        history: [],
        now: new Date(),
      };
    },
    created() {
      ipcRenderer.on('history-changed', (event, history) => {
        this.historyChanged(history);
      });
      ipcRenderer.send('created');
      setInterval(() => {
        this.now = new Date();
      }, 1000);
    },
    methods: {
      historyChanged(newHist) {
        this.history = newHist;
      },
      onItemCopy(item) {
        ipcRenderer.send('item-copied', item);
        this.$refs.snackbar.open();
      },
    },
  };
</script>

<style scoped>
    .scroll-area {
        overflow: auto;
    }
</style>
