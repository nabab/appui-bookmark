<!-- HTML Document -->

<div class="bbn-overlay bbn-flex-height appui-bookmark-block">
  <div class="bbn-padded bbn-b bbn-grid-fields">
    <bbn-input placeholder="Search a link"
               v-model="search"></bbn-input>
    <div class="bbn-m">
      <span>
        {{currentData.length}}
      </span>
      <label><?=_("links")?></label>
    </div>
  </div>

  <div class="bbn-flex-fill" >
    <bbn-scroll ref="scroll"
                @scroll="scrolling"
                @resize="resize"
                @ready="update"
                @reachBottom="addItems"
                axis="y">
      <div class="container">
        <appui-bookmark-item class="bookmark"
                             :source="block"
                             v-for="(block, i) in currentData"
                             :key="block.id"/>
      </div>
    </bbn-scroll>
  </div>
</div>