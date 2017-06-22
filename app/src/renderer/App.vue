<template>
    <div class='myWindow'>
        <toolbar></toolbar>
        <clipboard-history></clipboard-history>
        <snackbar></snackbar>
    </div>
</template>


<script>
  import './scrollbar.css';

  export default {
    name: 'app',
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
</style>
