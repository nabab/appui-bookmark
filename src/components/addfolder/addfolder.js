// Javascript Document

(()=> {
  const fn = (arr, res = []) => {
    bbn.fn.each(arr, a => {
      if (a.items) {
        fn(a.items, res);
      }
    });
    return res;
  };
  return {
    props: {
      node: {
        type: Vue,
        /*default() {
          return {
            icon: "nf nf-mdi-folder",
            id: null,
            id_option: null,
            id_parent: null,
            id_user_option: null,
            num: null,
            numChildren: 0,
            text: ""
          };*/
      },
      parentNode: {
        type: Vue,
        /*default() {
          return {
            icon: "nf nf-mdi-folder",
            id: null,
            id_option: null,
            id_parent: null,
            id_user_option: null,
            num: null,
            numChildren: 0,
            text: ""
          };*/
      },
      subfolder: {
        type: Boolean,
        default: false
      },
      tree: {
      }
    },
    data() {
      return {
        root: appui.plugins['appui-bookmark'] + '/',
        checkTimeout: 0,
        delId: "",
        currentNode: null,
        showGallery: false,
        visible: false,
        currentData: {
          title: this.node ? this.node.data.text : "",
          id: this.node ? this.node.data.id : null,
          id_parent: this.parentNode ? this.parentNode.data.id : null,
          icon: "nf nf-custom-folder"
        },
        currentSource: [],
        drag: true,
        bookmarkCp: null,
      }
    },
    computed: {
      blockSource() {
        let res = [];
        if (this.currentSource.length) {
          res = fn(this.currentSource);
        }
        return res;
      },
      formAction() {
        bbn.fn.log(this.parentNode);
        return (this.root + "actions/" + (this.currentData.id ? "modify" : "folder_insert"));
      }
    },
    methods: {
      onSuccess(data) {
        bbn.fn.log("OnSuccess Get : ", data, this.node);
        if (data.success) {
          if (this.parentNode && this.parentNode.data.id) {
            if (this.parentNode.data.id_parent && this.parentNode.data.numChildren) {
              this.parentNode.reload();
            }
            this.tree.reload();
          }
          else {
            this.tree.reload();
          }
        }
      },
      getData () {
        this.currentSource = [];
        bbn.fn.post(this.root + "actions/data", d => {
          this.currentSource = d.data;
        });
      },
      resetform() {
        this.currentData = {
          title: "",
          id: null,
        };
      },
      add() {
        bbn.fn.post(
          this.root + "actions/add",
          {
            title: this.currentData.title,
            id_parent:  this.currentData.idParent,
          },  d => {
            if (d.success) {
              this.currentData.id = d.id_bit;
              appui.success();
            }
          });
      },
      modify() {
        bbn.fn.post(this.root + "actions/modify", {
          title: this.currentData.title,
          id: this.currentData.id,
        },  d => {
          if (d.success) {
          }
        });
      },
    },
    beforeMount() {
      this.bookmarkCp = this.closest('bbn-container').getComponent();
    }
  }
})();