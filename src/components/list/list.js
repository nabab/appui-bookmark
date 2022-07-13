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
    mixins: [
      bbn.vue.basicComponent,
      bbn.vue.listComponent,
      bbn.vue.keepCoolComponent
    ],
    props: {
    },
    data() {
      return {
        //BLOCK DATA
        links: 0,
        search: "",
        currentWidth: 0,
        scrolltop: 0,
        scrollSize: 0,
        containerSize: 0,
        itemsPerPage: 0,
        start: 0,
        end: 0,
        isInit: false,
        isSorted: false,
        //TREE DATA
        root: appui.plugins['appui-bookmark'] + '/',
        checkTimeout: 0,
        delId: "",
        idParent: "",
        currentNode: null,
        showGallery: false,
        visible: false,
        drag: true,
        currentSource: [],
        editedfilter: [],
        /*editfilter: {
          url: "",
          title: "", //input
          image: "",
          description: "", //textarea
          id: null,
          images: [],
          screenshot_path: "",
          id_screenshot: "",
          clicked: 0,
        },*/
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
        /*
        if (this.source.data.length) {
          res = fn(this.source.data);
        }
        bbn.fn.log('ceci est un test');
        */
        return res;
      },
      numberShown() {
        let tmp = this.blockSource.length >= 10 ? 10 : this.blockSource.length;
        return tmp;
      },
      currentDataBlock() {
        return bbn.fn.order(this.blockSource, 'clicked', 'DESC');
      },
      numLinks() {
        return this.blockSource.length;
      },
    },
    methods: {
      //METHODS BOOKMARKS PART
      addItems() {
        if ( this.blockSource.length){
          this.start = this.numberShown;
          this.end = this.start + this.itemsPerPage;
          if ( this.end > this.blockSource.length ){
            this.end = this.blockSource.length;
          }
          for ( let i = this.start; i < this.end; i++ ){
            this.numberShown++;
          }
        }
      },
      setItemsPerPage() {
        if (this.blockSource.length) {
          let firstItem = this.getRef("item-" + this.filteredData[0].id);
          if (!firstItem || !firstItem.$el) {
            return;
          }
          let section = bbn.fn.outerHeight(firstItem.$el);
          let itemsPerRow = 0;
          let itemsPerColumn = 0;
          for (; itemsPerRow * section < this.currentWidth ; itemsPerRow++);
          for (; itemsPerColumn * section < this.containerSize ; itemsPerColumn++);
          this.itemsPerPage = itemsPerColumn * itemsPerRow * 2;
        }
        return;
      },
      update() {
        this.keepCool(
          () => {
            let scroll =  this.getRef('scroll');
            this.currentWidth = scroll.containerWidth;
            this.scrollSize = scroll.contentHeight;
            this.containerSize = scroll.containerHeight;
            this.setItemsPerPage();
            if (!this.isInit && this.itemsPerPage) {
              this.isInit = true;
              this.addItems();
            }
          }, "init", 250);
      },
      scrolling() {
        this.scrolltop = this.getRef('scroll').getRef('scrollContainer').scrollTop;
      },
      resize() {
        this.currentWidth = this.getRef('scroll').containerWidth;
        this.update();
      },
      //FUNCTION TREE PART
      openMenu(node) {
        let tmp_tree = this.getRef('tree');
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
                  node: node,
                  tree: tmp_tree
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
                icon: "nf-mdi-folder",
                component: 'appui-bookmark-addfolder',
                componentOptions: {
                  //source: node,
                  node: node,
                  tree: tmp_tree
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
                },
                title: node.id ? bbn._("Edit Form") : bbn._("New Form")
              })
            }
          });
        }
        menu.push({
          text: bbn._("Delete"),
          icon: "nf nf-mdi-delete",
          action: () => {
            this.deleteItem(node);
          }
        });
        menu.push({
          text: bbn._("Edit"),
          icon: "nf nf-fa-edit",
          action: () => {
            this.selectTree(node);
          }
        });
        return menu;
      },
      editItem(node) {
        bbn.fn.log('editItem() function');
        if (node.data.url) {
          bbn.fn.post(this.root + "actions/modify", {
            url: this.editedfilter.url,
            description: this.editedfilter.description,
            title: this.editedfilter.title,
            id: this.editedfilter.id,
            cover: this.editedfilter.cover,
            screenshot_path: this.editedfilter.screenshot_path,
            id_screenshot: this.editedfilter.id_screenshot,
          },  d => {
            if (d.success) {
              bbn.fn.log('success update item');
              if (node.data.id_parent) {
                node.reload();
              }
              else {
                let tmp_tree = this.getRef('tree');
                tmp_tree.reload();
              }
            } else {
              bbn.fn.log('error update item');
            }
          });
        } else {
          bbn.fn.post(this.root + "actions/modify", {
            title: this.editedfilter.title,
            id: this.editedfilter.id
          },  d => {
            if (d.success) {
            }
          });
        }

      },
      openUrlSource(source) {
        bbn.fn.log('OpenURLsource() function');
        if (source.url) {
          window.open(source.url, source.text);
          bbn.fn.post(
            this.root + "actions/count",
            {
              id: source.id,
            },
            d => {
              if (d.success) {
                this.editedfilter.clicked++;
              }
            }
          );
        }
      },
      openEditor(node) {
        bbn.fn.log('openEditor() function');
        let tmp_tree = this.getRef('tree');
        if (node.url) {
          bbn.fn.log('add action', node);
          this.getPopup({
            component: "appui-bookmark-form",
            componentOptions: {
              source: node,
              tree: tmp_tree
            },
            title: node.id ? bbn._("Edit Form") : bbn._("New Form")
          });
        } else {
          bbn.fn.log('add action', node);
          this.getPopup({
            component: "appui-bookmark-addfolder",
            componentOptions: {
              source: node,
              tree: tmp_tree
            },
            title: node.id ? bbn._("Edit Form") : bbn._("New Form")
          });
        }

      },
      contextMenu(bookmark) {
        bbn.fn.log('contextMenu() function');
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
      onDrop(nodeSrc, nodeDest, event) {
        bbn.fn.log('onDrop() function', arguments);
        if (nodeDest.data.url) {
          event.preventDefault();
        }
        else {
          bbn.fn.post(this.root + "actions/move", {
            source: nodeSrc.data.id,
            dest: nodeDest.data.id
          }, d => {
            if (d.success) {
              nodeSrc.reload();
              nodeDest.reload();
            }
          });
        }
      },
      openUrl() {
        bbn.fn.log('openURL() function');
        if (this.editedfilter.id) {
          window.open(this.root + "actions/go/" + this.editedfilter.id, this.editedfilter.id);
        }
        else {
          window.open(this.editedfilter.url, this.editedfilter.title);
        }
      },
      checkUrl() {
        bbn.fn.log('checkURL() function');
        if (!this.editedfilter.id && bbn.fn.isURL(this.editedfilter.url)) {
          bbn.fn.post(
            this.root + "actions/preview",
            {
              url: this.editedfilter.url,
            },
            d => {
              if (d.success) {
                this.editedfilter.title = d.data.title;
                this.editedfilter.description = d.data.description;
                this.editedfilter.cover = d.data.cover ||null;
                if (d.data.images) {
                  this.editedfilter.images = bbn.fn.map(d.data.images, (a) => {
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
        bbn.fn.log('selectTree() function');
        this.currentNode = node;
        this.openEditor(node.data);
      },
      screenshot() {
        bbn.fn.log('screenshot() function');
        bbn.fn.post(
          this.root + "actions/screenshot",
          {
            url: this.editedfilter.url,
            title: this.editedfilter.title,
            id: this.editedfilter.id
          },
          d => {
            if (d.success) {
              this.editedfilter.screenshot_path = d.data.screenshot_path;
              this.editedfilter.id_screenshot = d.data.id_screenshot;
            }
          }
        );
      },
      add() {
        bbn.fn.log('add() function');
        bbn.fn.post(
          this.root + "actions/add",
          {
            url: this.editedfilter.url,
            description: this.editedfilter.description,
            title: this.editedfilter.title,
            id_parent:  this.idParent,
            cover: this.editedfilter.cover,
          },  d => {
            if (d.success) {
              this.editedfilter.id = d.id_bit;
              this.editedfilter.clicked++;
              appui.success();
              this.screenshot();
            }
          });
      },
      addLink() {
        bbn.fn.log('addLink() function');
        this.openEditor({});
      },
      addFolder() {
        let tmp_tree = this.getRef('tree');
        this.getPopup({
          component: 'appui-bookmark-addfolder',
          componentOptions: {
            tree: tmp_tree
          },
          title: bbn._("New Folder")
        })
      },
      selectImage(img) {
        this.editedfilter.cover = img.data.content;
        this.showGallery = false;
      },

      modify() {
        bbn.fn.post(this.root + "actions/modify", {
          url: this.editedfilter.url,
          description: this.editedfilter.description,
          title: this.editedfilter.title,
          id: this.editedfilter.id,
          cover: this.editedfilter.cover,
          screenshot_path: this.editedfilter.screenshot_path,
          id_screenshot: this.editedfilter.id_screenshot,
        },  d => {
          if (d.success) {
          }
        });
      },
      importing() {
        this.getPopup({
          component: "appui-bookmark-uploader",
          componentOptions: null,
          title: false,
        });
      },
      deleteItem(node) {
        bbn.fn.log('deleteItem() function', node);
        let tmp_tree = this.getRef('tree');
        bbn.fn.log('tree = ', tmp_tree);
        let parent_node = node.parent;
        bbn.fn.log('node parent', parent_node, node.data.id_parent);
        bbn.fn.post(
          this.root + "actions/delete",
          {
            id: node.data.id
          },  d => {
            if (d.success) {
              bbn.fn.log('item delete success');
              //this.getData(); appeler une fonction qui enleve le bookmark
              if (parent_node) {
                parent_node.reload();
              }
              else {
                tmp_tree.reload();
              }
            }
            else {
              bbn.fn.log("error delete item");
            }
          });
        return;
      },
      deleteAllBookmarks() {
        this.confirm(bbn._("Are you sure you want to delete all your bookmarks ?"), () => {
          bbn.fn.post(
            this.root + "actions/delete_all_preferences",
            {
              allId: this.source.allId
            },  d => {
              if (d.success) {
                let tmp_tree = this.getRef('tree');
                bbn.fn.log("tree : ", tmp_tree);
                tmp_tree.reload();
                this.closest('bbn-container').reload();
              }
            });
        });
      },
      deletePreference() {
        bbn.fn.post(
          this.root + "actions/delete",
          {
            id: this.editedfilter.id
          },  d => {
            if (d.success) {
              let tmp_tree = this.getRef('tree');
              tmp_tree.reload();
              this.closest('bbn-container').reload();
            }
          });
        return;
      },
      showScreenshot() {
        this.visible = true;
      },
      updateWeb() {
        this.showGallery = true;
        bbn.fn.post(
          this.root + "actions/preview",
          {
            url: this.editedfilter.url,
          },
          d => {
            if (d.success) {
              if (d.data.images) {
                this.editedfilter.images = bbn.fn.map(d.data.images, (a) => {
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
      resetform() {
        bbn.fn.log('resetForm() function');
        this.editedfilter = {
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
      }
    },
    mounted() {
      let sc = this.getRef("scroll");
    },
    watch: {
      search() {
        this.numberShown = this.itemsPerPage;
        this.updateData();
      },
      'currentData.url'() {
        if (!this.editedfilter.id) {
          clearTimeout(this.checkTimeout);
          this.checkTimeout = setTimeout(() => {
            this.checkUrl();
          }, 250);
        }
      },
      currentNode(v) {
        if (v) {
          this.editedfilter = {
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