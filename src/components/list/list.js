// Javascript Document

(()=> {
  return {
    mixins: [
      bbn.vue.basicComponent,
      bbn.vue.listComponent,
      bbn.vue.keepCoolComponent
    ],
    data() {
      return {
        links: 0,
        currentWidth: 0,
        scrolltop: 0,
        scrollSize: 0,
        containerSize: 0,
        itemsPerPage: 0,
        start: 0,
        end: 0,
        isInit: false,
        filter: "",
        root: appui.plugins['appui-bookmark'] + '/',
        checkTimeout: 0,
        editedfilter: {},
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
    methods: {
      //METHODS BOOKMARKS PART
      setItemsPerPage() {
        if (this.filteredData.length) {
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
      //UPDATE PART OF BLOCK
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
      //ADD BOOKMARKS TO THE LIST IN THE BLOCK
      addItems() {
        if ( this.blockSource.length){
          this.start = this.numberShown;
          this.end = this.start + this.itemsPerPage;
          if ( this.end > this.blockSource.length ){
            this.end = this.blockSource.length;
          }
          for ( let i = this.start; i < this.end; i++ ) {
            this.numberShown++;
          }
        }
      },
      //MENU OF THE RIGHT CLICK
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
                title: node && node.id ? bbn._("Edit Form") : bbn._("New Form")
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
      //FORM FOR ADD/EDIT LINK
      addLink(node) {
        bbn.fn.log('openEditor() function');
        let tmp_tree = this.getRef('tree');
        if (!node) {
          bbn.fn.log('ADD FUNCTION() function');
          let tmp_tree = this.getRef('tree');
          bbn.fn.log('add action', node);
          this.getPopup({
            component: "appui-bookmark-form",
            componentOptions: {
              source: node,
              tree: tmp_tree
            },
            title: node && node.id ? bbn._("Edit Form") : bbn._("New Form")
          });
        }
        else if (node.url) {
          bbn.fn.log('add action', node);
          this.getPopup({
            component: "appui-bookmark-form",
            componentOptions: {
              source: node,
              tree: tmp_tree
            },
            title: node && node.id ? bbn._("Edit Form") : bbn._("New Form")
          });
        } else {
          bbn.fn.log('add action', node);
          this.getPopup({
            component: "appui-bookmark-addfolder",
            componentOptions: {
              source: node,
              tree: tmp_tree
            },
            title: node && node.id ? bbn._("Edit Form") : bbn._("New Form")
          });
        }
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
      //IMPORT FROM FILE
      importing() {
        this.getPopup({
          component: "appui-bookmark-uploader",
          componentOptions: null,
          title: false,
        });
      },
      //CHECK IF URL IS VALID AND RELOAD THE FORM IF NECESSARY
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
      //DELETE ELEMENT
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
      //DRAG AND DROP
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
    },
    watch: {
      filter(v, ov) {
        if (!v || (v.length < 2)) {
          this.data.filter = "";
          this.updateData();
          if (this.currentFilters.conditions.length) {
            this.unfilter();
          }
        }
        else {
          this.data.filter = v;
          this.updateData();
        }
      },
      'currentData.url'() {
        if (!this.editedfilter.id) {
          clearTimeout(this.checkTimeout);
          this.checkTimeout = setTimeout(() => {
            this.checkUrl();
          }, 250);
        }
      }
    }
  }
})();