// Javascript Document

(()=> {
  return {
    mixins: [
      bbn.vue.basicComponent,
      bbn.vue.listComponent,
      bbn.vue.keepCoolComponent,
      bbn.vue.resizerComponent
    ],
    data() {
      return {
        selectionMode: false,
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
        loading: true,
        root: appui.plugins['appui-bookmark'] + '/',
        checkTimeout: 0,
        editedfilter: {},
        elements: [],
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
      actionSource() {
        return [
          {
            text: bbn._("Take screenshot"),
            value: 1,
            action: () => {
              bbn.fn.each(this.currentSelected, a => {
                let item = this.getRef('item-' + a);
                if (item) {
                  item.puppeteer_screenshot();
                }
              });
              this.selectionMode = false;
            }
          },
          {
            text: bbn._("Delete"),
            value: 2,
            action: () => {
              this.deleteItem()
            }
          }
        ]
      },
      numberShown() {
        return this.elements.length;
      }
    },
    methods: {
      /**
       * setup bookmarks page items
       *
       * @method setItemsPerPage
       */
      setItemsPerPage() {
        if (this.filteredData.length) {
          let firstItem = this.getRef("item-" + this.filteredData[0].data.id);
          if (!firstItem || !firstItem.$el) {
            return;
          }
          /** @var {Number} section Height of the first element in the list */
          let section = bbn.fn.outerHeight(firstItem.$el);
          let itemsPerRow = 0;
          let itemsPerColumn = 0;
          for (; itemsPerRow * section < this.currentWidth ; itemsPerRow++);
          for (; itemsPerColumn * section < this.containerSize ; itemsPerColumn++);
          this.itemsPerPage = itemsPerColumn * itemsPerRow * 2;
        }
        return;
      },
      /**
       * update part of bookmarks items
       *
       * @method update
       */
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
      afterUpdate() {
        bbn.fn.each(this.filteredData, a => {
          this.elements.push(a.data);
        });
        this.loading = false;
      },
      scrolling() {
        this.scrolltop = this.getRef('scroll').getRef('scrollContainer').scrollTop;
      },
      resize() {
        this.currentWidth = this.getRef('scroll').containerWidth;
        this.update();
      },
      /**
       * Menu of the right click
       *
       * @method openMenu
       */
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
            this.addLink(node);
          }
        });
        return menu;
      },
      /**
       * Add bookmarks to the list in the block
       *
       * @method addItems
       */
      addItems(limit) {
        if (this.total && (this.total > this.numberShown)) {
          this.start = this.numberShown;
          this.currentLimit = bbn.fn.isNumber(limit) ? limit : this.itemsPerPage;
          this.updateData();
        }
      },
      /**
       * Form add / edit for a new bookmark
       *
       * @method addLink
       */
      addLink(node) {
        let tmp_tree = this.getRef('tree');
        if (!node) {
          this.getPopup({
            component: "appui-bookmark-form",
            componentOptions: {
              tree: tmp_tree
            },
            title: bbn._("New Bookmark")
          });
        }
        else if (node.url) {
          this.getPopup({
            component: "appui-bookmark-form",
            componentOptions: {
              source: node,
              status: node.id ? true : false,
              tree: tmp_tree
            },
            title: node && node.id ? bbn._("Edit Bookmark") : bbn._("New Bookmark")
          });
        }
        else if (node.data.url) {
          this.getPopup({
            component: "appui-bookmark-form",
            componentOptions: {
              source: node.data,
              status: node.data.id ? true : false,
              tree: tmp_tree
            },
            title: node.data.id ? bbn._("Edit Bookmark") : bbn._("New Bookmark")
          });
        }
        else {
          this.getPopup({
            component: "appui-bookmark-addfolder",
            componentOptions: {
              source: node,
              tree: tmp_tree
            },
            title: node && node.id ? bbn._("Edit Folder") : bbn._("New Folder")
          });
        }
      },
      /**
       * Form add / edit for a new folder
       *
       * @method addFolder
       */
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
      /**
       * Importing file from toolbar
       *
       * @method importing
       */
      importing() {
        this.getPopup({
          component: "appui-bookmark-uploader",
          componentOptions: null,
          title: false,
        });
      },
      /**
       * check if the url is valid and reload the form if necessary
       *
       * @method checkUrl
       */
      checkUrl() {
        if (!this.editedfilter.id && bbn.fn.isURL(this.editedfilter.url)) {
          bbn.fn.post(
            this.root + "actions/preview",
            {
              url: this.editedfilter.url,
            },
            d => {
              if (d.success) {
                this.editedfilter.text = d.data.title;
                this.editedfilter.description = d.data.description;
                this.editedfilter.cover = d.data.cover || null;
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
      /**
       * delete element
       *
       * @method deleteItem
       */
      deleteItem(node) {
        if (this.currentSelected.length) {
          bbn.fn.post(
            this.root + "actions/delete",
            {
              ids: this.currentSelected
            },  d => {
              if (d.success) {
                let tmp_tree = this.getRef('tree');
                this.closest('bbn-container').reload();
                tmp_tree.reload();
              }
              this.selectionMode = false;
            });
        }
        else if (node.parent) {
          let tmp_tree = this.getRef('tree');
          let parent_node = node.parent;
          let idx = bbn.fn.search(this.elements, { id: node.data.id});

          bbn.fn.post(
            this.root + "actions/delete",
            {
              id: node.data.id
            },  d => {
              if (d.success) {
                if (idx >= 0) {
                  this.elements.splice(idx, 1);
                  this.addItems(1);
                }
                if (parent_node) {
                  parent_node.reload();
                }
                else {
                  tmp_tree.reload();
                }
              }
            });
        } else {
          let idNode = node.id;
          let tmp_tree = this.getRef('tree');
          let treeNode = tmp_tree.getNodeByUid(node.id);
          let parentNode = tmp_tree.getNodeByUid(node.id_parent);
          let idx = bbn.fn.search(this.elements, { id: node.id});
          bbn.fn.post(
            this.root + "actions/delete",
            {
              id: node.id
            },  d => {
              if (d.success) {
                if (treeNode) {
                  treeNode.parent.reload();
                }
                else if (parentNode) {
                  let treeParent = parentNode.getRef('tree');
                  for (let a = 0; a < treeParent.currentData.length; a++) {
                    if (treeParent.currentData[a].data.id === idNode) {
                      treeParent.currentData.splice(a, 1);
                    }
                  }
                }

                if (this.elements[idx]) {
                  this.elements.splice(idx, 1);
                  this.addItems(1);
                }
              }
            });
        }
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
                tmp_tree.reload();
                this.closest('bbn-container').reload();
              }
            });
        });
      },
      /**
       * drag and drop
       *
       * @method onDrop
       */
      //DRAG AND DROP
      onDrop(nodeSrc, nodeDest, event) {
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
      selectionMode(v) {
        this.currentSelected.splice(0, this.currentSelected.length);
      },
      filter(v, ov) {
        this.elements.splice(0, this.elements.length);
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
      }
    }
  }
})();