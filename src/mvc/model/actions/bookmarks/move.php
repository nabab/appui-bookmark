<?php
/**
 * What is my purpose?
 *
 **/

/** @var $model \bbn\Mvc\Model*/
use bbn\X;

if ($model->data['source'] && $model->data['dest']) {
  $tmp = $model->inc->pref->moveBit($model->data['source'], $model->data['dest']);
  $model->data['res'] = true;
}

return $model->data['res'];