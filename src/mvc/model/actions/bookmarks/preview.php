<?php
/**
 * What is my purpose?
 *
 **/

/** @var $model \bbn\Mvc\Model*/

use bbn\X;
use Dusterio\LinkPreview\Client;

$res = ['success' => false];

if ($model->hasData('url', true)) {
  $previewClient = new Client($model->data['url']);
  try {
    $preview = $previewClient->getPreview('general');
  }
  catch (\Exception $e) {
    $res['error'] = $e->getMessage();
  }
  if ($preview) {
    $res['success'] = true;
    $res['data'] = $preview->toArray();
  }
}

return $res;