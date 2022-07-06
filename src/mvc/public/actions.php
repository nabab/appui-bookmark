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
  //X::ddump($ctrl->pluginUrl('appui-bookmark'). '/actions/' . $action . $params);
  $ctrl->addToObj($ctrl->pluginUrl('appui-bookmark'). '/actions/' . $action . $params, $ctrl->post, true);
}