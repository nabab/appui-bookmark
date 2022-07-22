<?php
/**
     * What is my purpose?
     *
     **/

/** @var $model \bbn\Mvc\Model*/
use Dusterio\LinkPreview\Client;
use Nesk\Puphpeteer\Puppeteer;
use bbn\X;
use bbn\Str;

$res = ['success' => false];
$id_bscreen = $model->inc->options->fromCode("bscreenshot", "media", "note", "appui");

if ($model->hasData('id')) {
  if ($bit = $model->inc->pref->getBit($model->data['id'])) {
    $res['success'] = $model->inc->pref->updateBit($model->data['id'], [
      'clicked' => ($bit['clicked'] ?? 0) + 1,
    ], true);
  }
  $res['success'] = true;
}

//X::ddump($res, $model->data['clicked'], $model->data['id']);

return $res;