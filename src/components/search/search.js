// Javascript Document

(() => {
  return {
    props: {
    },
    data() {
      return {
        search: "",
        checkTimeout: 0,
      };
    },
    methods: {
      checkSearch() {
        // method to find a link
      },
    },
    watch: {
      search() {
        clearTimeout(this.checkTimeout);
        this.checkTimeout = setTimeout(() => {
          this.checkSearch();
        }, 350);
      }
    }
  };
})();