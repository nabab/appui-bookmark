<bbn-table class="bbn-h-100"
           ref="table"
           :source="root + 'pages/wordpress'"
           :limit="25"
           :info="true"
           :pageable="true"
           :sortable="true"
           :selection="true"
           :filterable="true"
>
  <bbns-column field="ID"
               label="<?= _("ID") ?>"               
               cls="bbn-c"
               :width="50"
  ></bbns-column>

  <bbns-column field="post_type"
               label="<?= _("Post Type") ?>"               
               cls="bbn-c"
  ></bbns-column>
 
  <bbns-column field="post_name"
               label="<?= _("Post Name") ?>"               
               cls="bbn-c"
  ></bbns-column>

  <bbns-column field="url"
               label="<?= _("Page url") ?>"               
               :render="renderUrl"
               :width="300"
               cls="bbn-c"
  ></bbns-column>

  <bbns-column field="post_title"
               label="<?= _("Post title") ?>"
  ></bbns-column>

  <bbns-column field="post_content"
               label="<?= _("Post Content") ?>"               
               :width="300"
               :filterable="false"
  ></bbns-column>

  <bbns-column field="display_name"
               label="<?= _("Author") ?>"                              
  ></bbns-column>

  <bbns-column field="post_date"
               label="<?= _("Date") ?>"
               type="datetime"
               :render="renderDate"
              
  ></bbns-column>
  <bbns-column field="post_date_gmt"
               label="<?= _("Date GMT") ?>"
               type="datetime"
               :render="renderDateGmt"
               
  ></bbns-column>

  <bbns-column field="post_modified"
               label="<?= _("Post modified") ?>"
               type="datetime"
               :render="renderDateModified"
              
  ></bbns-column>
  
  <bbns-column field="post_status"
               label="<?= _("Post Status") ?>"
               cls="bbn-c" 
  ></bbns-column>
 
</bbn-table>

