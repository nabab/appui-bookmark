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
          url: "",
          title: "", //input
          image: "",
          description: "", //textarea
          id: null,
          images: [],
          id_parent: this.node ? this.node.data.id : null,
          screenshot_path: "",
          id_screenshot: "",
          count: 0,
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
          this.currentData.url = this.source.url;
          this.currentData.title = this.source.text;
          this.currentData.id_screenshot = this.source.id_screenshot;
          this.currentData.screenshot_path = this.source.screenshot_path;
          this.currentData.id = this.source.id;
          this.currentData.description = this.source.description;
          this.currentData.cover = this.source.cover;
        }
        /*if (this.currentData.id) {
          this.modify();
          return;
        }
        this.add();*/
        return (this.root + "actions/" + (this.currentData.id ? "modify" : "add"));
      }
    },
    methods: {
      onSuccess(data) {
        bbn.fn.log("OnSuccess Get : ", data, this.node);
        if (data.success) {
          if (this.node && this.node.id_parent) {
            bbn.fn.log("OnSuccess Get : ", this.node);
            this.node.reload();
          }
          else {
            this.tree.reload();
          }
        }
      },
      showScreenshot() {
        this.visible = true;
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
      add() {
        bbn.fn.post(
          this.root + "actions/add",
          {
            url: this.currentData.url,
            description: this.currentData.description,
            title: this.currentData.title,
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
    },
    beforeMount() {
      this.bookmarkCp = this.closest('bbn-container').getComponent();
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
    }
  }
})();