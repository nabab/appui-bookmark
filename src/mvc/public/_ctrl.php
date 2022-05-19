<?php
/** @var $ctrl \bbn\Mvc\Controller */
if ( !\defined('APPUI_NOTE_ROOT') ){
  define('APPUI_NOTE_ROOT', $ctrl->pluginUrl('appui-note').'/');
}
$ctrl->data['root'] = $ctrl->pluginUrl('appui-note').'/';
