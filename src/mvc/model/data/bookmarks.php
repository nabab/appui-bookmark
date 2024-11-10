<?php
/**
 * What is my purpose?
 *
 **/

use bbn\X;
use bbn\Str;
/** @var bbn\Mvc\Model $model */
$id_list = $model->inc->options->fromCode("list", "bookmarks", "note", "appui");
$my_list = $model->inc->pref->getByOption($id_list);
$tree = $my_list ? $model->inc->pref->getTree($my_list['id']) : false;

return $tree;