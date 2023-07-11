<?php
/**
   * What is my purpose?
   *
   **/

/** @var $model \bbn\Mvc\Model*/

use bbn\X;

$id_list = $model->inc->options->fromCode("list", "bookmarks", "note", "appui");
$my_list = $model->inc->pref->getByOption($id_list);
$res['success'] = $model->inc->pref->deleteBits($my_list['id']);

return $res;