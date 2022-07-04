// Javascript Document

(() => {
  return {
    props: {
      heightMin: 0, // à définir
      heightMax: 0, // à définir
      source: {
        type: Object,
        required: true,
      },
      scrollSize: {
        type: Number,
        validator(v) {
          return v >= 0;
        }
      },
      containerSize: {
        type: Number,
        validator(v) {
          return v >= 0;
        }
      },
      scrollTop: {
        type: Number,
        validator(v) {
          return v >= 0;
        }
      },
      width: {
        type: Number,
        validator(v) {
          return v >= 0;
        }
      },
    },
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
          image: "",
          screenshot_path: "",
          id_screenshot: "",
          clicked: 0,
          cover: ""
        },
        openedWindow: {},
        links: 0,
        search: "",
        checkTimeout: 0,
        currentSource: [],
        totalHeight: 0,
        position: null,
        sectionTop: null,
        visibleSize: 0,
        viewMax: 0,
        viewMin: 0,
      }
    },
    mounted() {
      this.updatePosition();
    },
    computed: {
      isVisible() {
        if (this.containerSize && this.scrollSize && (this.position !== null)) {
          this.viewMin = this.scrollTop - this.containerSize;
          this.viewMax = this.scrollTop + (2 * this.containerSize);
          if ((this.viewMin < this.position) && (this.position < this.viewMax)) {
            return true;
          }
        }
        return false;
      },
    },
    methods: {
      updatePosition() {
        this.position = this.$el.offsetTop;
      },
      openEditor(bookmark) {
        this.getPopup({
          component: "appui-bookmark-form",
          componentOptions: {
            source: bookmark
          },
          title: bookmark.id ? bbn._("Edit Form") : bbn._("New Form")
        });
      },
      openUrlSource(source) {
        if (source.url) {
          window.open(source.url, source.text);
          bbn.fn.post(
            this.root + "actions/count",
            {
              id: source.id,
              searchCover: !source.cover
            },
            d => {
              if (d.success) {
                this.source.clicked++;
                if (d.data) {
                  if (this.source.cover === undefined) {
                    this.$set(this.source, 'cover', d.data.path);
                  }
                  else {
                    this.source.cover = d.data.path;
                  }
                }
                this.closest('appui-bookmark-block').updateData();
              }
            }
          );
        }
      },
      deletePreference(bookmark) {
        bbn.fn.post(
          this.root + "actions/delete",
          {
            id: bookmark.id
          },  d => {
            if (d.success) {
            }
          });
        return;
      },
      showScreenshot() {
        this.visible = true;
      },
      contextMenu(bookmark) {
        return [
          {
            text: bbn._("Edit"),
            icon: "nf nf-fa-edit",
            action: () => {
              this.openEditor(bookmark)
            }
          },
          {
            text: bbn._("Delete"),
            icon: "nf nf-mdi-delete",
            action: () => {
              this.deletePreference(bookmark);
            }
          }
        ];
      },
    },
    watch: {
      width() {
        this.updatePosition();
      }
    }
  }
})();