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
        type: Vue
      },
      source: {
      	type: Object,
        default() {
          return {};
        }
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
          title: "", //input
          id: null,
          id_parent: this.node ? this.node.data.id : null
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
        if (this.source.id) {
          this.currentData.title = this.source.text;
          this.currentData.id = this.source.id;
        }
        return (this.root + "actions/" + (this.currentData.id ? "modify" : "folder_insert"));
      }
    },
    methods: {
      onSuccess(data) {
        bbn.fn.log("OnSuccess Get : ", data, this.node);
        if (data.success) {
          if (this.node) {
            bbn.fn.log("OnSuccess Get : ", this.node);
            this.node.reload();
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