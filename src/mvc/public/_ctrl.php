<?php
/** @var $ctrl \bbn\Mvc\Controller */
if ( !\defined('APPUI_BOOKMARK_ROOT') ){
  define('APPUI_BOOKMARK_ROOT', $ctrl->pluginUrl('appui-bookmark').'/');
}
$ctrl->data['root'] = $ctrl->pluginUrl('appui-bookmark').'/';
