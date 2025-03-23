<!-- HTML Document -->

<div class="bbn-padding bbn-l-padded"
     style="min-width: 50em margin-left: 1em">
  <div class="bbn-right-padding">
    <bbn-upload
              :label="label"
              :auto-upload="true"
              :download="true"
							:save-url="root + 'actions/import'"
              @success="success"/>
  </div>
</div>