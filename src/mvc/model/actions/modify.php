<?php
/**
   * What is my purpose?
   *
   **/

/** @var $model \bbn\Mvc\Model*/

use bbn\X;

$res = ['success' => false];

if ($model->data['id'] ||$model->data['title']) {
  $model->inc->pref->updateBit($model->data['id'], [
    'text' => $model->data['title'],
    'url' => $model->data['url'],
    'description' => $model->data['description'],
    'cover' => $model->data['cover'] ?? null,
    'count' => $model->data['count'] ?? 0,
  ], true);
  $res['success'] = true;
}

return $res;