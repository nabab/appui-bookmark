// Javascript Document

(() => {
  return {
    props: {

    },
    data() {
      return {
        label: {
          title: "Upload your bookmarks",
        },
        root: appui.plugins['appui-bookmark'] + '/',
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