<!-- HTML Document -->

<section class="appui-bookmark-item">
  <bbn-context bbn-if="isVisible"
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
    <img bbn-if="source.cover"
         :src="source.cover"
         :label="_('Open the link')"/>
    <div bbn-else
         class="default-image"
         :label="_('Open the link')"
         />
    </div>
  </bbn-context>
</section>