<!-- HTML Document -->

<section class="appui-bookmark-item">
  <bbn-context v-if="isVisible"
               :context="true"
               :source="contextMenu(source)"
               tag="div"
               class="bbn-overlay">
    <div @click="openUrlSource(source)">
      <div class="url bbn-xspadded">
      <span>
        {{source.text}}
      </span>
    </div>
    <div class="urlT bbn-xspadded">
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