<!-- HTML Document -->

<section :class="['appui-bookmark-item', 'bbn-nomargin', 'bbn-unselectable', {
                 'bbn-primary': selected
                 }]">
  <bbn-context :disabled="isSelectionMode"
               :context="true"
               :source="contextMenu()"
               tag="div"
               class="bbn-overlay">
    <div class="appui-note-widget-bookmark bbn-c bookmark-item"
         @click="select">
      <figure class="item_zone bbn-smargin">
        <appui-bookmark-defaultcover class="icon" :cover="source.cover"/>
        <div class="figcaption_zone">
          <figcaption><a v-text="source.text" href="javascript:;"/></figcaption>
        </div>
      </figure>
    </div>
  </bbn-context>
</section>