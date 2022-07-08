<?php
/**
   * What is my purpose?
   *
   **/

/** @var $model \bbn\Mvc\Model*/

use bbn\X;
$res = ['success' => false];
$id_list = $model->inc->options->fromCode("list", "bookmark", "appui");
$my_list = $model->inc->pref->getByOption($id_list);

//revoir le return du deleteBits
$model->inc->pref->deleteBits($my_list['id']);
$res['success'] = true;
return $res;