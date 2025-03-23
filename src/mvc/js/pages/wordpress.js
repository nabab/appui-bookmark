(()=>{
  return {
    data(){
      return {     
        root: appui.plugins['appui-bookmark'] + '/',     
      }
    },
    methods:{
      renderUrl(row){
        if ( row.url !== null ){
          return '<a href="' +row.url +'">'+row.url+'</a>';
        }
        return '-';
      },
      renderDate(row){
        return dayjs(row.post_date).format('DD/MM/YYYY HH:mm');
      },
      renderDateModified(row){
        return dayjs(row.post_modified).format('DD/MM/YYYY HH:mm');
      },
      renderDateGmt(row){
        return dayjs(row.post_date_gmt).format('DD/MM/YYYY HH:mm');
      }
    }    
  }
})();