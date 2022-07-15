<!-- HTML Document -->

<div class="bbn-overlay appui-bookmark-list">
  <bbn-splitter orientation="horizontal"
                :resizable="true">

    <bbn-pane :size="300">
      <div class="bbn-flex-height bbn-overlay">
        <bbn-toolbar :source="toolbarSource"/>
        <div class="bbn-flex-fill">
          <div class="bbn-overlay">
            <bbn-tree :source="root + 'tree'"
                      uid="id"
                      ref="tree"
                      :draggable="true"
                      @drop="onDrop"
                      :menu="openMenu"/>
          </div>
        </div>
      </div>
    </bbn-pane>

    <bbn-pane>
      <div class="bbn-overlay bbn-flex-height appui-bookmark-block">
        <div class="bbn-padded bbn-b bbn-grid-fields">
          <bbn-input placeholder="Search a link"
                     v-model="filter"></bbn-input>
          <div class="bbn-m">
            <span>
              {{total}}
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
                                   v-for="(block, i) in filteredData"
                                   :source="block.data"
                                   :key="block.data.id"/>
            </div>
          </bbn-scroll>
        </div>
      </div>
    </bbn-pane>
  </bbn-splitter>
</div>
