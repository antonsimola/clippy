<template>
    <div>
        <md-toolbar class="md-dense drag">
            <md-button class="md-icon-button no-drag" @click.native="toggleLeftDrawer()">
                <md-icon no-drag>menu</md-icon>
            </md-button>
            <h2 class="md-title no-select" style="flex: 1">{{title}}</h2>
        </md-toolbar>
        <md-sidenav class="md-left" ref="leftDrawer">
            <md-toolbar class="md-large">
                <div class="md-toolbar-container">
                    <h3 class="md-title">Settings</h3>
                </div>
            </md-toolbar>

            <p>Settings</p>
        </md-sidenav>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        title: 'Clippy',
      };
    },
    methods: {
      toggleLeftDrawer() {
        this.$refs.leftDrawer.toggle();
      },
    },

  };
</script>
<style scoped>
    .drag {
        -webkit-user-select: none;
        -webkit-app-region: drag;
    }

    .no-drag {
        -webkit-app-region: no-drag;
    }
</style>
