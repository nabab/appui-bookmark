<?php
/**
   * What is my purpose?
   *
   **/

/** @var $model \bbn\Mvc\Model*/

use bbn\X;

$res = ['success' => false];

if ($model->hasData(['id', 'url', 'text'])) {
  $bit = $model->inc->pref->getBit($model->data['id']);
  if ($model->hasData('file', true)) {
    $path = $model->inc->user->getTmpDir().$model->data['file'];
  }
  $model->inc->pref->updateBit($model->data['id'], [
    'text' => $model->data['text'],
    'url' => $model->data['url'],
    'description' => $model->data['description'] ?? "",
    'cover' => $model->data['cover'] ?? null,
    'count' => $model->data['count'] ?? 0,
  ], true);
  $res['success'] = true;
}
return $res;