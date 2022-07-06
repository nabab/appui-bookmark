<!-- HTML Document -->

<div class="appui-bookmark-form bbn-w-100"
     style="min-width: 30em;">
  <bbn-form :action="formAction"
            :source="currentData"
            v-model="currentData"
            @success="onSuccess"
            class="bbn-m">
    <div class="bbn-padded bbn-grid-fields" >
      <label><?=_("Title")?></label>
      <bbn-input v-model="currentData.title"
                 :required="true"
                 placeholder="Name of the URL"></bbn-input>
    </div>
  </bbn-form>
</div>
