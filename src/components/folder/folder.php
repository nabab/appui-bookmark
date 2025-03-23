<bbn-form :prefilled="true"
          :validation="folder"
          class="bbn-padding"
          :buttons="[]"
          >
  <div class="bbn-padding bbn-grid-fields">
    <div class="bbn-grid-full">
      <i class="nf nf-fa-times bbn-p" bbn-if="parent !== 'ROOT'" @click="removeParent" title="<?= _("Create the link at root") ?>"></i> 
      <span class="bbn-green bbn-b" bbn-text="( parent !== 'ROOT' ) ? '<?= _('Create the folder in')?>' +  ' ' + path : '<?=_('Create the folder at root or select a folder from the tree') ?>'"></span>   
               
    </div>
    <div class="bbn-padding">
      <span><?= _("New folder") ?></span>
    </div>  
    <div class="bbn-padding">
      <bbn-input bbn-model="text"
                 @keydown.enter.prevent.stop="submit"
      ></bbn-input>
    </div>
    <bbn-input type="hidden" :value="parent"></bbn-input>
  </div>
  <div class="bbn-l bbn-padding">
    <bbn-button label="<?= _("Cancel") ?>" 
                icon="nf nf-fa-times"
                @click="closeForm"
    >
    </bbn-button>
    <bbn-button label="<?= _("Create folder") ?>" 
                icon="nf nf-fa-check"
                @click="submit"
    >
    </bbn-button>
  </div>
</bbn-form>