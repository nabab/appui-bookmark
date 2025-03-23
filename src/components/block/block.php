<!-- HTML Document -->

<div class="bbn-overlay bbn-flex-height appui-bookmark-block">
  <div class="bbn-padding bbn-b bbn-grid-fields">
    <bbn-input placeholder="Search a link"
               bbn-model="search"></bbn-input>
    <div class="bbn-m">
      <span>
        {{currentData.length}}
      </span>
      <label><?= _("links") ?></label>
    </div>
  </div>

  <div class="bbn-flex-fill" >
    <bbn-scroll ref="scroll"
                @scroll="scrolling"
                @resize="resize"
                @ready="update"
                @reachBottom="addItems">
      <appui-bookmark-item bbn-for="(block, i) in currentData"
                                 bbn-if="i < numberShown"
                                 :source="block"
                                 :key="block.id"
                                 :scroll-size="scrollSize"
                                 :container-size="containerSize"
                                 :scroll-top="scrolltop"
                                 :width="currentWidth"
                                 :ref="'item-'+ block.id"
                                 />
    </bbn-scroll>
  </div>
</div>