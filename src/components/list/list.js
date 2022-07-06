// Javascript Document

(()=> {
  const fn = (arr, res = []) => {
    bbn.fn.each(arr, a => {
      if (a.url) {
        res.push({
          cover: a.cover ||"",
          description: a.description || "",
          id: a.id,
          id_screenshot: a.id_screenshot || null,
          screenshot_path: a.screenshot_path || "",
          text: a.text,
          url: a.url,
          clicked: a.clicked || 0
        });
      }
      else if (a.items) {
        fn(a.items, res);
      }
    });
    return res;
  };
  return {
    props: {
    },
    data() {
      return {
        root: appui.plugins['appui-bookmark'] + '/',
        checkTimeout: 0,
        delId: "",
        idParent: "",
        currentNode: null,
        showGallery: false,
        visible: false,
        currentData: {
          url: "",
          title: "", //input
          image: "",
          description: "", //textarea
          id: null,
          images: [],
          screenshot_path: "",
          id_screenshot: "",
          clicked: 0,
        },
        currentSource: [],
        drag: true,
        toolbarSource: [
          {
            icon: "nf nf-fa-plus",
            text: bbn._("Create a new link"),
            notext: true,
            action: this.addLink,
          },
          {
            icon: "nf nf-mdi-folder_plus",
            text: bbn._("Add folder"),
            notext: true,
            action: this.addFolder,
          },
          {
            icon: "nf nf-mdi-folder_upload",
            text: bbn._("Import bookmarks"),
            notext: true,
            action: this.importing,
          },
          {
            icon: "nf nf-fa-trash",
            text: bbn._("Delete all bookmarks"),
            notext: true,
            action: this.deleteAllBookmarks,
          }
        ]
      }
    },
    computed: {
      blockSource() {
        let res = [];
        if (this.source.data.length) {
          res = fn(this.source.data);
        }
        return res;
      },
    },
    methods: {
      openMenu(node) {
        let menu = [];
        if (!node.data.url) {
          menu.push({
            icon: "nf nf-fa-plus",
            text: bbn._("Create a new link in this folder"),
            action: () => {
              this.getPopup({
                component: "appui-bookmark-form",
                componentOptions: {
                  //source: node,
                  node: node
                },
                title: bbn._("New Link")
              });
            }
          });
          menu.push({
            icon: "nf nf-mdi-folder_plus",
            text: bbn._("Create a subfolder in this folder"),
            action: () => {
              bbn.fn.log('add folder', node);
              this.getPopup({
                component: 'appui-bookmark-addfolder',
                componentOptions: {
                  //source: node,
                  node: node
                },
              })
            }
          });
          menu.push({
            icon: "nf nf-mdi-folder_upload",
            text: bbn._("Import from file in this folder"),
            action: () => {
              this.getPopup({
                component: "appui-bookmark-uploader",
                componentOptions: {
                  //source: node,
                  node: node
                }
              })
            }
          });
          return menu;
        }
      },
      importing() {
        this.getPopup({
          component: "appui-bookmark-uploader",
          componentOptions: null,
          title: false,
        });
      },
      deleteAllBookmarks() {
        this.confirm(bbn._("Are you sure you want to delete all your bookmarks ?"), () => {
          bbn.fn.post(
            this.root + "actions/delete_all_preferences",
            {
              allId: this.source.allId
            });
        });
      },
      showScreenshot() {
        this.visible = true;
      },
      updateWeb() {
        this.showGallery = true;
        bbn.fn.post(
          this.root + "actions/preview",
          {
            url: this.currentData.url,
          },
          d => {
            if (d.success) {
              if (d.data.images) {
                this.currentData.images = bbn.fn.map(d.data.images, (a) => {
                  return {
                    content: a,
                    type: 'img'
                  }
                })
              }
            }
            return false;
          }
        );
      },
      openUrl() {
        if (this.currentData.id) {
          window.open(this.root + "actions/go/" + this.currentData.id, this.currentData.id);
        }
        else {
          window.open(this.currentData.url, this.currentData.title);
        }
      },
      openUrlSource(source) {
        if (source.url) {
          window.open(source.url, source.text);
          bbn.fn.post(
            this.root + "actions/count",
            {
              id: source.id,
            },
            d => {
              if (d.success) {
                this.currentData.clicked++;
              }
            }
          );
        }
      },
      openEditor(bookmark) {
        bbn.fn.log('add action', bookmark);
        this.getPopup({
          component: "appui-bookmark-form",
          componentOptions: {
            source: bookmark
          },
          title: bookmark.id ? bbn._("Edit Form") : bbn._("New Form")
        });
      },
      addLink() {
        this.openEditor({});
      },
      contextMenu(bookmark) {
        return [
          {
            text: bbn._("Edit"),
            icon: "nf nf-fa-edit",
            action: () => {
              this.openEditor(bookmark)
            }
          }
        ];
      },
      resetform() {
        this.currentData = {
          url: "",
          title: "",
          image: "",
          description: "",
          id: null,
          images: [],
          cover: null,
          id_screenshot: ""
        };
        this.idParent = "";
      },
      isDragEnd(event, nodeSrc, nodeDest) {
        if (nodeDest.data.url) {
          event.preventDefault();
        }
        else {
          bbn.fn.post(this.root + "actions/move", {
            source: nodeSrc.data.id,
            dest: nodeDest.data.id
          }, d => {
          });
        }
      },
      checkUrl() {
        if (!this.currentData.id && bbn.fn.isURL(this.currentData.url)) {
          bbn.fn.post(
            this.root + "actions/preview",
            {
              url: this.currentData.url,
            },
            d => {
              if (d.success) {
                this.currentData.title = d.data.title;
                this.currentData.description = d.data.description;
                this.currentData.cover = d.data.cover ||null;
                if (d.data.images) {
                  this.currentData.images = bbn.fn.map(d.data.images, (a) => {
                    return {
                      content: a,
                      type: 'img'
                    }
                  })
                }
              }
              return false;
            }
          );
        }
      },
      selectTree(node) {
        this.currentNode = node;
        this.openEditor(node.data);
      },
      screenshot() {
        bbn.fn.post(
          this.root + "actions/screenshot",
          {
            url: this.currentData.url,
            title: this.currentData.title,
            id: this.currentData.id
          },
          d => {
            if (d.success) {
              this.currentData.screenshot_path = d.data.screenshot_path;
              this.currentData.id_screenshot = d.data.id_screenshot;
            }
          }
        );
      },
      add() {
        bbn.fn.log("error detected add");
        bbn.fn.post(
          this.root + "actions/add",
          {
            url: this.currentData.url,
            description: this.currentData.description,
            title: this.currentData.title,
            id_parent:  this.idParent,
            cover: this.currentData.cover,
          },  d => {
            if (d.success) {
              this.currentData.id = d.id_bit;
              this.currentData.clicked++;
              appui.success();
              this.screenshot();
            }
          });
      },
      selectImage(img) {
        this.currentData.cover = img.data.content;
        this.showGallery = false;
      },
      addFolder() {
        this.getPopup({
          component: 'appui-bookmark-addfolder'
        })
      },
      modify() {
        /*bbn.fn.post(
                  "action/delete",
                  {
                    id: this.currentData.id
                  },  d => {
                    if (d.success) {
                    }
                  });
                bbn.fn.post(
                  "action/add",
                  {
                    url: this.currentData.url,
                    description: this.currentData.description,
                    title: this.currentData.title,
                    id_parent:  this.idParent,
                  },  d => {
                    if (d.success) {
                      this.$refs.tree.reload();
                    }
                  });*/
        bbn.fn.post(this.root + "actions/modify", {
          url: this.currentData.url,
          description: this.currentData.description,
          title: this.currentData.title,
          id: this.currentData.id,
          cover: this.currentData.cover,
          screenshot_path: this.currentData.screenshot_path,
          id_screenshot: this.currentData.id_screenshot,
        },  d => {
          if (d.success) {
          }
        });
      },
      deletePreference() {
        bbn.fn.post(
          this.root + "actions/delete",
          {
            id: this.currentData.id
          },  d => {
            if (d.success) {
            }
          });
        return;
      },
    },
    mounted() {
      let sc = this.getRef("scroll");
    },
    watch: {
      'currentData.url'() {
        if (!this.currentData.id) {
          clearTimeout(this.checkTimeout);
          this.checkTimeout = setTimeout(() => {
            this.checkUrl();
          }, 250);
        }
      },
      currentNode(v) {
        if (v) {
          this.currentData = {
            url: v.data.url || "",
            title: v.data.text || "",
            description: v.data.description || "",
            id: v.data.id || "",
            cover: v.data.cover || null,
            id_screenshot: v.data.id_screenshot || "",
            screenshot_path: v.data.screenshot_path || "",
            clicked: v.data.clicked || 0
          };
        }
        else {
          this.resetForm();
        }
      },
    }
  }
})();