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

$res['success'] = false;
$id_bscreen = $model->inc->options->fromCode("bscreenshot", "media", "note", "appui");

if ($model->data['id']) {
  $bit = $model->inc->pref->getBit($model->data['id']);
  $model->inc->pref->updateBit($model->data['id'], [
    'clicked' => ($bit['clicked'] ?? 0) + 1,
  ], true);
  if ($model->hasData("searchCover", true)) {
    $media = new bbn\Appui\Medias($model->db);
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
            if ($id_media = $media->insert($filename, [], $bit['text'] ?: "", "bscreenshot")) {
              $bit['path'] = $media->getImageUrl($id_media);
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
    $model->inc->pref->updateBit($model->data['id'], [
      'cover' => $model->data['cover'] ?? $res['data']['path'],
    ], true);
  }
  $res['success'] = true;
}

//X::ddump($res, $model->data['clicked'], $model->data['id']);

return $res;