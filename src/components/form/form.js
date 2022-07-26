// Javascript Document

(()=> {
  const fn = (arr, res = []) => {
    bbn.fn.each(arr, a => {
      if (a.url) {
        res.push({
          cover: a.cover || "",
          description: a.description || "",
          id: a.id,
          id_screenshot: a.id_screenshot || null,
          screenshot_path: a.screenshot_path || "",
          text: a.text,
          url:a.url
        })
      }
      else if (a.items) {
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
      tree: {
      },
      status: {
      },
      source: {
        type: Object,
        default() {
          return {
            url: "",
            text: "", //input
            image: "",
            description: "", //textarea
            id: null,
            cover: "",
            images: [],
            id_parent: this.node ? this.node.data.id : null,
            screenshot_path: "",
            id_screenshot: "",
            count: 0
          };
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
        currentData: this.source,
        currentSource: [],
        drag: true,
        bookmarkCp: null,
        formDisabled: false
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
        return (this.root + "actions/" + (this.currentData.id ? "modify" : "add"));
      }
    },
    methods: {
      onSuccess(data) {
        if (data.success) {
          if (this.node && this.node.id_parent) {
            this.node.reload();
          }
        }
      },
      showScreenshot() {
        this.visible = true;
      },
      /**
       * Screenshot of puppeteer
       *
       * @method puppeteer_preview
       */
      puppeteer_preview() {
        this.formDisabled = true;
        bbn.fn.post(
          this.root + "actions/puppeteer_preview",
          this.currentData,
          d => {
            this.formDisabled = false;
            if (d.success) {
              if (d.image) {
                this.currentData.cover = d.image;
              }
            }
            return false;
          }
        );
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
                this.currentData.text = d.data.title;
                this.currentData.description = d.data.description;
                this.currentData.cover = d.data.cover || null;
                if (d.data.images.length) {
                  this.currentData.images = bbn.fn.map(d.data.images, (a) => {
                    return {
                      content: a,
                      type: 'img'
                    }
                  })
                }
                this.$forceUpdate();
              }
              return false;
            }
          );
        }
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
              if (d.data.images.length) {
                bbn.fn.log(d.data.images.length);
                this.currentData.images = bbn.fn.map(d.data.images, (a) => {
                  return {
                    content: a,
                    type: 'img'
                  }
                })
              }
              this.$forceUpdate();
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
          window.open(this.currentData.url, this.currentData.text);
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
                this.currentData.count = d.count;
              }
            }
          );
        }
      },
      getData () {
        this.currentSource = [];
        bbn.fn.post(this.root + "actions/data", d => {
          this.currentSource = d.data;
        });
      },
      resetform() {
        bbn.fn.log("test reset");
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
      },
      updateform() {
        if (this.currentData.url) {
          clearTimeout(this.checkTimeout);
          this.checkTimeout = setTimeout(() => {
            bbn.fn.post(
              this.root + "actions/preview",
              {
                url: this.currentData.url,
              },
              d => {
                if (d.success) {
                  bbn.fn.log('preview = ', d.data);
                  this.currentData.text = d.data.title;
                  this.currentData.description = d.data.description;
                  this.currentData.cover = d.data.cover || null;
                  if (d.data.images.length) {
                    bbn.fn.log(d.data.images.length);
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
          }, 250);
        }
      },
      add() {
        bbn.fn.post(
          this.root + "actions/add",
          {
            url: this.currentData.url,
            description: this.currentData.description,
            title: this.currentData.text,
            id_parent:  this.currentData.idParent,
            cover: this.currentData.cover,
          },  d => {
            if (d.success) {
              this.currentData.id = d.id_bit;
              this.currentData.count = 0;
              appui.success();
              this.screenshot();
            }
          });
      },
      selectImage(img) {
        this.currentData.cover = img.data.content;
        this.showGallery = false;
      },
      modify() {
        bbn.fn.post(this.root + "actions/modify", {
          url: this.currentData.url,
          description: this.currentData.description,
          title: this.currentData.text,
          id: this.currentData.id,
          cover: this.currentData.cover,
          screenshot_path: this.currentData.screenshot_path,
          id_screenshot: this.currentData.id_screenshot,
        },  d => {
          if (d.success) {
          }
        });
      },
    },
    beforeMount() {
      this.bookmarkCp = this.closest('bbn-container').getComponent();
    },
    watch: {
      'currentData.url'(v) {
        if (!this.currentData.id) {
          clearTimeout(this.checkTimeout);
          this.checkTimeout = setTimeout(() => {
            this.checkUrl();
          }, 250);
        }
      },
    }
  }
})();