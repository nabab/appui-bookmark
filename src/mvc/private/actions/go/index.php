<?php


/** @var $ctrl \bbn\Mvc\Controller */

if ($ctrl->hasArguments()) {
  $ctrl->addData(['id' => $ctrl->arguments[0]])->action();
}
