<!-- HTML Document -->

<div class="appui-bookmark-form bbn-w-100">
  <bbn-form :action="formAction"
            :source="currentData"
            v-model="currentData"
            @success="onSuccess"
            class="bbn-m">
    <div class="bbn-padded bbn-grid-fields" >
      <label><?=_("URL")?></label>
      <div style="min-width: 30em;">
        <div class="bbn-flex-width">
          <bbn-input v-model="currentData.url"
                     class="bbn-flex-fill bbn-right-space"></bbn-input>
          <bbn-button class="bbn-w-2"
                      @click="openUrl"
                      text="Go to"></bbn-button>
        </div>
      </div>

      <label><?=_("Title")?></label>
      <bbn-input v-model="currentData.title"
                 :required="true"
                 placeholder="Name of the URL"></bbn-input>

      <label><?=_("URL's description")?></label>
      <bbn-textarea v-model="currentData.description"></bbn-textarea>

      <div v-if="currentData.cover">
        <img :src="currentData.cover"
             style="max-width: 200px; max-height: 200px; width: auto; height: auto">
      </div>
      <div v-if="currentData.cover">
        <bbn-button v-if="currentData.images"
                    @click="showGallery = true"
                    text="change cover picture"></bbn-button>
      </div>
      <div>
        <bbn-floater v-if="showGallery"
                     :title="_('Pick a cover picture')"
                     :closable="true"
                     :width="500"
                     :height="500"
                     :scrollable="false"
                     @close="showGallery = false">
          <bbn-gallery :source="currentData.images"
                       class="bbn-overlay"
                       @clickItem="selectImage"
                       :selecting-mode="true"
                       :zoomable="false"
                       :scrollable="true"
                       ></bbn-gallery>
        </bbn-floater>
      </div>
      <div>
        <bbn-button	v-if="currentData.id_screenshot"
                    @click="showScreenshot"
                    class="bbn-padded"
                    text="show screenshot"
                    ></bbn-button>
        <bbn-floater v-if="visible"
                     :closable="true"
                     :width="800"
                     :height="600"
                     :resizable="true"
                     :title="_('a screenshot from the site')"
                     @close="visible = false">
          <img :src="root + 'media/image/' + currentData.id_screenshot">
        </bbn-floater>
      </div>
    </div>
  </bbn-form>
</div>
