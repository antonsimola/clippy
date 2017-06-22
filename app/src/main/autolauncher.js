import AutoLaunch from 'auto-launch';

export default {

  launcher: new AutoLaunch({
    name: 'Clippy',
  }),

  enable() {
    if (process.env.NODE_ENV !== 'development') {
      this.launcher.enable();
    }
  },
  disable() {
    this.launcher.disable();
  },
};
