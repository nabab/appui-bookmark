// Javascript Document

(() => {
  return {
    props: {
      selected: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        root: appui.plugins['appui-bookmark'] + '/',
        list: null,
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
          cover: ""
        }
      }
    },
    computed: {
      isSelectionMode() {
        return !!(this.list && this.list.selectionMode);
      }
    },
    methods: {
      /**
       * Context menu linked with component-list
       *
       * @Method contextMenu
       */
      contextMenu() {
        let list = this.closest('appui-bookmark-list');
        return [
          {
            text: bbn._("Copy URL"),
            icon: "nf nf-fa-copy",
            action: () => {
              bbn.fn.copy(this.source.url);
            }
          },
          {
            text: bbn._("Edit"),
            icon: "nf nf-fa-edit",
            action: () => {
              list.addLink(this.source);
            }
          },
          {
            text: bbn._("Screenshot"),
            icon: "nf nf-mdi-fullscreen",
            action: () => {
              this.puppeteer_screenshot(this.source);
            }
          },
          {
            text: bbn._("Delete"),
            icon: "nf nf-mdi-delete",
            action: () => {
              list.deleteItem(this.source);
            }
          }
        ];
      },
      /**
       * Screenshot with puppeteer for get a preview
       *
       * @Method puppeteer_screenshot
       */
      puppeteer_screenshot() {
        bbn.fn.post(
          this.root + "actions/puppeteer_preview",
          this.source,
          d => {
            if (d.success) {
              if (d.image) {
                this.source.cover = d.image;
                this.updateItem(this.source);
              }
            }
          });
      },
      select() {
        if (this.isSelectionMode) {
          let idx = this.list.currentSelected.indexOf(this.source.id);
          if (idx > -1) {
            this.list.currentSelected.splice(idx, 1);
          }
          else {
            this.list.currentSelected.push(this.source.id);
          }
        }
        else {
          this.openUrlSource(this.source);
        }
      },
      /**
       * Open Url of a bookmark
       *
       * @Method openUrlSource
       */
      openUrlSource() {
        if (this.source.url) {
          window.open(this.source.url, this.source.text);
          bbn.fn.post(
            this.root + "actions/count",
            {
              id: this.source.id,
            },
            d => {
              if (d.success) this.source.clicked++;
            }
          );
          if (!this.source.cover) {
            bbn.fn.post(
              this.root + "actions/puppeteer_preview", this.source,
              d => {
                if (d.success) {
                  this.$set(this.source, 'cover', d.image);
                  this.updateItem();
                }
              }
            );
          }
        }
      },
      /**
       * Update all element on the bookmark
       *
       * @Method updateItem
       */
      updateItem() {
        bbn.fn.post(
          this.root + "actions/modify", {
            //A CHANGER
            id: this.source.id,
            id_option: this.source.id_option,
            num: this.source.num,
            text: this.source.text,
            cover: this.source.cover,
            url: this.source.url,
            id_screenshot: this.source.id_screenshot,
            screenshot_path: this.source.screenshot_path,
          }, d => {
            if (d.success) {
            }
          });
      },
    },
    mounted() {
      this.list = this.closest('appui-bookmark-list');
    }
  }
})();