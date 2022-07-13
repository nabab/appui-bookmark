<?php

use bbn\X;
use bbn\Str;
/** @var $ctrl \bbn\Mvc\Controller */


if ($ctrl->hasArguments()) {
  $action = array_shift($ctrl->arguments);
  $params = '';
  if (count($ctrl->arguments)) {
    $params = '/' . X::join($ctrl->arguments, '/');
  }
  /*
  if ($action === 'go') {
    $ctrl->setMode('dom');
    $ctrl->addToObj($ctrl->pluginUrl('appui-bookmark'). '/actions/go/index' . $params, $ctrl->post, true);
  }
  else {*/
  $ctrl->addToObj($ctrl->pluginUrl('appui-bookmark'). '/actions/' . $action . $params, $ctrl->post, true);
  /*}
  //X::ddump($ctrl->pluginUrl('appui-bookmark'). '/actions/' . $action . $params);*/
}