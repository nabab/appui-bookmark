// Javascript Document

(()=> {
  return {
    data() {
      return {
        root: appui.plugins['appui-bookmark'] + '/',
      };
    },
    mounted() {
      let sc = this.getRef("scroll");
    }
  };
})();