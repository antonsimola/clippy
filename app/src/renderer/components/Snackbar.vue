<template>
    <md-snackbar md-position="bottom center" ref="snackbar" md-duration="2000">
        <span>{{text}}</span>
    </md-snackbar>
</template>

<script>
  import { EventBus } from './../event-bus';

  export default {

    data() {
      return {
        text: '',
      };
    },
    created() {
      EventBus.$on('show-snackbar', text => {
        this.text = text;
        this.$refs.snackbar.open();
      });
    },
  };

</script>
