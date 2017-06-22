<template>
    <md-list-item>
        <div class="md-list-text-container">
            <span v-html="linkifiedText"></span>
            <span>{{historyItem.time | moment("from", now)}}</span>
        </div>
        <md-button class="md-icon-button md-list-action" @click.native="onItemCopy">
            <md-icon>content_copy</md-icon>
        </md-button>
    </md-list-item>
</template>

<script>
  import { ipcRenderer } from 'electron';
  import { EventBus } from './../event-bus';
  import linkifyStr from 'linkifyjs/string';

  export default {
    props: ['historyItem', 'now'],
    computed: {
      linkifiedText() {
        return linkifyStr(this.historyItem.text);
      },
    },
    methods: {
      onItemCopy() {
        ipcRenderer.send('item-copied', this.historyItem);
        EventBus.$emit('show-snackbar', 'Item copied to clipboard!');
      },
    },
  };
</script>
