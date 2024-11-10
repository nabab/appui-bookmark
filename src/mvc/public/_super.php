<?php
/** @var bbn\Mvc\Controller $ctrl */
if ( !\defined('APPUI_NOTE_ROOT') ){
  define('APPUI_NOTE_ROOT', $ctrl->pluginUrl('appui-note').'/');
}
$ctrl->data['root'] = $ctrl->pluginUrl('appui-note').'/';
