<template>
    <div class='myWindow'>
        <toolbar></toolbar>
        <clipboard-history></clipboard-history>
    </div>
</template>


<script>
  import Toolbar from './components/Toolbar';
  import ClipboardHistory from './components/ClipboardHistory';

  export default {
    name: 'app',
    components: {
      Toolbar,
      ClipboardHistory,
    },
  };

</script>
<style scoped>
    .myWindow {
        height: 550px;
        display: flex;
        flex-flow: column;
        position: relative;
        overflow: hidden;
        z-index: 1;
    }

    ::-webkit-scrollbar {
        width: 10px;
        height: 50px;
    }

    ::-webkit-scrollbar-thumb {
        background: #E91E63;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: #E91E63;
    }

    ::-webkit-scrollbar-thumb:active {
        background: #E91E63;
    }

    ::-webkit-scrollbar-track {
        background: #9e9e9e;
        border: 0 solid #9e9e9e;
    }

    ::-webkit-scrollbar-track:hover {
        background: #9e9e9e;
    }

    ::-webkit-scrollbar-track:active {
        background:#9e9e9e;
    }

    ::-webkit-scrollbar-corner {
        background: transparent;
    }
</style>
