// Javascript Document

(() => {
  return {
    mixins: [
      bbn.vue.keepCoolComponent
    ],
    props: {
      source: {
        offset: this.offset
      }
    },
    data() {
      return {
        root: appui.plugins['appui-bookmark'] + '/',
        links: 0,
        search: "",
        checkTimeout: 0,
        currentSource: [],
        numberShown: this.source.length >= 10 ? 10 : this.source.length,
        currentWidth: 0,
        scrolltop: 0,
        offset: 0,
        scrollSize: 0,
        containerSize: 0,
        itemsPerPage: 0,
        start: 0,
        end: 0,
        isInit: false,
        isSorted: false,
        currentData: bbn.fn.order(this.source, 'clicked', 'DESC')
      }
    },
    computed: {
      numLinks() {
        return this.source.length;
      },
    },
    methods: {
      updateData() {
        this.currentData = bbn.fn.order(this.search ? bbn.fn.filter(this.source,'text', this.search, 'contains') : this.source , 'clicked', 'DESC');
      },
      addItems() {
        if ( this.source.length){
          this.start = this.numberShown;
          this.end = this.start + this.itemsPerPage;
          if ( this.end > this.source.length ){
            this.end = this.source.length;
          }
          for ( let i = this.start; i < this.end; i++ ){
            this.numberShown++;
          }
        }
      },
      setItemsPerPage() {
        if (this.source.length) {
          let firstItem = this.getRef("item-" + this.currentData[0].id);
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
      isVisible() {
        return false;
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
      newform() {
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
      deletePreference(bookmark) {
        bbn.fn.post(
          this.root + "actions/delete",
          {
            id: bookmark.id
          },  d => {
            if (d.success) {
              //this.getData(); appeler une fonction qui enleve le bookmark
            }
          });
        return;
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
                this.source.clicked = d.clicked;
              }
            }
          );
        }
      },
    },
    watch: {
      search() {
        this.numberShown = this.itemsPerPage;
        this.updateData();
      },
    }
  }
})();