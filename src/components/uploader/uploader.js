// Javascript Document

(() => {
  return {
    props: {
      node: {
        type: Vue
      }
    },
    data() {
      return {
        currentNode: this.node,
        title: {
          title: "Upload your bookmarks",
        },
        root: appui.plugins['appui-bookmark'] + '/',
        bookmarksName: "bookmarks.html",
      };
    },
    computed: {
      isFolder() {
        bbn.fn.log("isFolder :", this.currentNode);
        if (!this.currentNode.data.url) {
          bbn.fn.log("folder found : ", this.currentNode.data.id);
          return ('/' + this.currentNode.data.id);
        }
        return "";
      }
    },
    methods: {
      success() {
        this.closest('bbn-container').reload();
      },
    },
  }
})();