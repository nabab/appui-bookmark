<?php
/**
 * What is my purpose?
 *
 **/

/** @var $model \bbn\Mvc\Model*/

use bbn\Str;
use bbn\X;
use Dusterio\LinkPreview\Client;
use Nesk\Puphpeteer\Puppeteer;


$db = new \bbn\Db(['name' => 'test']);

$media = new bbn\Appui\Medias($db);

$res = [
  "success" => false
];

if ($model->data['id'] && ($bit = $model->inc->pref->getBit($model->data['id']))) {
  $puppeteer = new Puppeteer;
  try {
    $browser = $puppeteer->launch([
      "defaultViewport" => [
        "width" => 1200,
        "height" => 800
      ],
      "waitForInitialPage" => false
    ]);


    $filename = BBN_DATA_PATH.Str::genpwd().".png";
    $page = $browser->newPage();
    if ($page && $page->goto($bit['url'])) {
      //$page->click(".gdpr-lmd-button.gdpr-lmd-button--main");
      if ($page->screenshot(['path' => $filename])) {
        if ($id_media = $media->insert($filename, [], $bit['text'] ?: "")) {
          $bit['path'] = $media->getPath($id_media);
          $bit['id_screenshot'] = $id_media;
          $model->inc->pref->updateBit($bit['id'], $bit, true);
          $browser->close();
          $res['success'] = true;
          $res['data'] = $bit;
        }
      }
    }
  }
  catch (\Exception $e) {
    $res['error'] = $e->getMessage();
  }
}

return $res;