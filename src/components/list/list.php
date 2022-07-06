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
                      @select="selectTree"
                      :draggable="true"
                      @dragEnd="isDragEnd"
                      :menu="openMenu"/>
          </div>
        </div>
      </div>
    </bbn-pane>

    <bbn-pane>

      <appui-bookmark-block :source="blockSource"/>
    </bbn-pane>
  </bbn-splitter>
</div>
