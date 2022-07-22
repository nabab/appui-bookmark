// Javascript Document

(() => {
  return {
    data() {
      return {
        root: appui.plugins['appui-bookmark'] + '/',
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
    methods: {
      /**
       * Context menu linked with component-list
       *
       * @Method contextMenu
       */
      contextMenu(bookmark) {
        let list = this.closest('appui-bookmark-list');
        return [
          {
            text: bbn._("Copy URL"),
            icon: "nf nf-fa-copy",
            action: () => {
              bbn.fn.copy(bookmark.url);
            }
          },
          {
            text: bbn._("Edit"),
            icon: "nf nf-fa-edit",
            action: () => {
              list.addLink(bookmark);
            }
          },
          {
            text: bbn._("Screenshot"),
            icon: "nf nf-mdi-fullscreen",
            action: () => {
              this.puppeteer_screenshot(bookmark);
            }
          },
          {
            text: bbn._("Delete"),
            icon: "nf nf-mdi-delete",
            action: () => {
              list.deleteItem(bookmark);
            }
          }
        ];
      },
      /**
       * Screenshot with puppeteer for get a preview
       *
       * @Method puppeteer_screenshot
       */
      puppeteer_screenshot(bookmark) {
        bbn.fn.post(
          this.root + "actions/puppeteer_preview",
          bookmark,
          d => {
            if (d.success) {
              if (d.image) {
                bookmark.cover = d.image;
                this.updateItem(bookmark);
              }
            }
          });
      },
      /**
       * Open Url of a bookmark
       *
       * @Method openUrlSource
       */
      openUrlSource(source) {
        if (source.url) {
          window.open(source.url, source.text);
          bbn.fn.post(
            this.root + "actions/count",
            {
              id: source.id,
            },
            d => {
              if (d.success) this.source.clicked++;
            }
          );
          if (!source.cover) {
            bbn.fn.post(
              this.root + "actions/puppeteer_preview", source,
              d => {
                if (d.success) {
                  this.$set(this.source, 'cover', d.image);
                  this.updateItem(source);
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
      updateItem(bookmark) {
        bbn.fn.post(
          this.root + "actions/modify", {
            //A CHANGER
            id: bookmark.id,
            id_option: bookmark.id_option,
            num: bookmark.num,
            text: bookmark.text,
            cover: bookmark.cover,
            url: bookmark.url,
            id_screenshot: bookmark.id_screenshot,
            screenshot_path: bookmark.screenshot_path,
          }, d => {
            if (d.success) {
            }
          });
      },
    }
  }
})();