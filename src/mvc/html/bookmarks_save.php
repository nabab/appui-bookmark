<!-- HTML Document -->
<div class="bbn-overlay bookmarks-container">
  <bbn-splitter orientation="horizontal">
    <bbn-pane size="50%"
    >
			<div class="bbn-100">
        <div class="bbn-padding button-container">
          <bbn-button icon="nf nf-fa-star"
                      class="bbn-padding star"
                      @click="showFormLinkM"
                      title="<?= _('New bookmark') ?>"
                      label="<?= _('New bookmark') ?>"
                      ></bbn-button>
          <bbn-button icon="nf nf-fa-folder_plus"
                      class="bbn-padding"
                      @click="showFormFolderM"
                      title="<?= _('New folder') ?>"
                      label="<?= _('New folder') ?>"
          ></bbn-button>
        </div>
        <div class="bbn-100">
          <bbn-tree v-if="!remakeTree"
                    :source="filter"
                    @select="select"
                    class="bbn-medium"
          ></bbn-tree>
        </div>
      </div>
    </bbn-pane>
    <bbn-pane>
      <appui-note-bookmarks-link v-if="showFormLink && !showFormFolder"
                                 :source="showLink"/>
      <appui-note-bookmarks-folder v-else-if="showFormFolder && !showFormLink"
                                   :source="showFolder"/>
      <!--appui-note-bookmarks-list v-else-if="currentNode && (selectedType === 'folder') && !showFormFolder && !showFormLink">
      </appui-note-bookmarks-list-->
      <appui-note-bookmarks-show v-else-if="(showLink.text || showFolder.text) && !showFormFolder && !showFormLink"
                                  :source="{showLink: showLink,showFolder:showFolder}"/>


    </bbn-pane>
  </bbn-splitter>
  <!--appui-note-bookmarks-booksform></appui-note-bookmarks-booksform-->
</div>