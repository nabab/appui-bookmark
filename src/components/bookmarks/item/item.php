<!-- HTML Document -->

<section class="appui-note-bookmarks-item">
  <bbn-context v-if="isVisible"
               :context="true"
               :source="contextMenu(source)"
               tag="div"
               class="bbn-overlay">
    <div @click="openUrlSource(source)">
      <div class="url bbn-xspadding">
      <span>
        {{source.text}}
      </span>
    </div>
    <div class="urlT bbn-xspadding">
      <span>
        {{source.text}}
      </span>
    </div>
    <img v-if="source.cover"
         :src="source.cover"
         :text="_('Open the link')"/>
    <div v-else
         class="default-image"
         :text="_('Open the link')"
         />
    </div>
  </bbn-context>
</section>