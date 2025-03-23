<?php
/**
 * What is my purpose?
 *
 **/

/** @var bbn\Mvc\Model $model */
use bbn\X;

if ($model->data['source'] && $model->data['dest']) {
  $tmp = $model->inc->pref->moveBit($model->data['source'], $model->data['dest']);
  $model->data['res'] = true;
}

return $model->data['res'];