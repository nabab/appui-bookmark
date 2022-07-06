<?php
/**
 * What is my purpose?
 *
 **/

use bbn\X;
use bbn\Str;
/** @var $model \bbn\Mvc\Model*/
$id_list = $model->inc->options->fromCode("list", "bookmark", "appui");
$my_list = $model->inc->pref->getByOption($id_list);
$tree = $my_list ? $model->inc->pref->getBits($my_list['id']) : [];

return $tree;