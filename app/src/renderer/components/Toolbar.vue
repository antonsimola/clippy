<template>
    <div>
        <md-toolbar class="drag">
            <md-button class="md-icon-button no-drag" @click.native="toggleLeftDrawer()">
                <md-icon no-drag>menu</md-icon>
            </md-button>
            <h2 class="md-title no-select" style="flex: 1">Clippy</h2>
            <md-button class="md-icon-button no-drag" @click.native="close()">
                <md-icon no-drag>close</md-icon>
            </md-button>
        </md-toolbar>
        <md-sidenav class="md-left" ref="leftDrawer">
            <md-toolbar class="md-large">
                <div class="md-toolbar-container">
                    <h3 class="md-title">Settings</h3>
                </div>
            </md-toolbar>
            <md-list>
                <md-list-item>
                    <div class="md-list-item-container">
                        <span>Launch at startup</span>
                        <md-checkbox class="md-accent md-list-action" v-model="preferences.autoStart"></md-checkbox>
                    </div>
                </md-list-item>
                <md-list-item>
                    <div class="md-list-item-container">
                        <md-input-container>
                            <label for="expiry">Expiry of Items</label>
                            <md-select name="expiry" id="expiry" v-model="preferences.expirySeconds">
                                <md-option value="-1">Never</md-option>
                                <md-option value="60">1 minute</md-option>
                                <md-option value="300">5 minutes</md-option>
                                <md-option value="900">15 minutes</md-option>
                                <md-option value="3600">1 hour</md-option>
                                <md-option value="28800">8 hours</md-option>
                                <md-option value="86400">24 hours</md-option>
                            </md-select>
                        </md-input-container>
                    </div>
                </md-list-item>
            </md-list>
        </md-sidenav>
    </div>
</template>

<script>
  import { ipcRenderer } from 'electron';

  export default {
    data() {
      return {
        showSearch: false,
        preferences: {
          autoStart: true,
          expirySeconds: -1,
        },
      };
    },
    created() {
      ipcRenderer.on('preferences-changed', (event, newPreferences) => {
        this.preferences = newPreferences;
      });
      ipcRenderer.send('toolbar-created');
    },
    watch: {
      preferences: {
        handler() {
          ipcRenderer.send('preferences-changed', this.preferences);
        },
        deep: true,
      },
    },
    methods: {
      toggleLeftDrawer() {
        this.$refs.leftDrawer.toggle();
      },
      close() {
        ipcRenderer.send('closed');
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
