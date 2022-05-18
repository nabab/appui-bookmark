// Javascript Document

(() => {
  return {
    props: {

    },
    data() {
      return {
        title: {
          title: "Upload your bookmarks",
        },
        root: appui.plugins['appui-note'] + '/',
        bookmarksName: "bookmarks.html",
      };
    },
    methods: {
      success() {
        this.closest('bbn-container').reload();
      },
    },
  }
})();