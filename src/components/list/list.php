<!-- HTML Document -->

<div class="bbn-overlay appui-bookmark-list">
  <bbn-splitter orientation="horizontal"
                :resizable="true"
                :collapsible="true">

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
      <div class="bbn-overlay bbn-flex-height list-block">
        <div class="bbn-padded bbn-b bbn-w-100">
          <bbn-button :text="selectionMode ? '<?= _("Stop multiple selection") ?>' : '<?= _("Select multiple items") ?>'"
                      icon="nf nf-mdi-checkbox_multiple_marked_outline"
                      :notext="true"
                      class="bbn-lg bbn-right-margin"
                      @click="selectionMode = !selectionMode"/>
          <bbn-dropdown placeholder="<?= _("Action to perform") ?>"
                        v-if="selectionMode"
                        :disabled="currentSelected.length <= 1"
                        source-action="action"
                        class="bbn-right-margin"
                        :source="actionSource"
                        ></bbn-dropdown>
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
                      @reachbottom="addItems"
                      axis="y">
            <div class="container">
              <appui-bookmark-item class="bookmark"
                                   v-for="(block, i) in elements"
                                   :source="block"
                                   :selected="currentSelected.indexOf(block.id) > -1"
                                   :ref="'item-' + block.id"
                                   :key="block.id"/>
            </div>
          </bbn-scroll>
        </div>
      </div>
    </bbn-pane>
  </bbn-splitter>
    <div v-if="loading"
       class="bbn-overlay bbn-middle bbn-modal">
    <div class="bbn-block bbn-padded bbn-lg">
      <bbn-loadicon/> &nbsp;
      <?= _("Please wait") ?><br>
    </div>
  </div>
</div>
