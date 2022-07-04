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

    if ($model->hasData("searchCover", true)) {
      $timer = new bbn\Util\Timer();
      $media = new bbn\Appui\Medias($model->db);
      $res['cover'] = false;
      $timer->start("new Object");
      $puppeteer = new Puppeteer;
      $timer->stop("new Object");
      try {
        $timer->start("Launch");
        $browser = $puppeteer->launch([
          "defaultViewport" => [
            "width" => 1200,
            "height" => 800
          ],
          "waitForInitialPage" => false
        ]);
        $timer->stop("Launch");
        $filename = BBN_DATA_PATH.Str::genpwd().".png";
        $timer->start("New page");
        $page = $browser->newPage();
        $timer->stop("New page");
        $timer->start("Go to page");
        if ($page && $page->goto($bit['url'])) {
          $timer->stop("Go to page");
          //$page->click(".gdpr-lmd-button.gdpr-lmd-button--main");
          $timer->start("Screenshot");
          if ($page->screenshot(['path' => $filename])) {
            $timer->stop("Screenshot");
            if ($id_media = $media->insert($filename, [], $bit['text'] ?: "", "bscreenshot")) {
              $bit['path'] = $media->getImageUrl($id_media);
              $bit['id_screenshot'] = $id_media;
              $model->inc->pref->updateBit($bit['id'], $bit, true);
              $timer->start("Close browser");
              $browser->close();
              $timer->stop("Close browser");
              $res['success'] = true;
              $res['data'] = $bit;
            }
          }
        }
        X::log($timer->results(), "pupeteer");
      }
      catch (\Exception $e) {
        $res['error'] = $e->getMessage();
      }
      $model->inc->pref->updateBit($model->data['id'], [
        'cover' => $model->data['cover'] ?? $res['data']['path'],
      ], true);
    }
  }
  $res['success'] = true;
}

//X::ddump($res, $model->data['clicked'], $model->data['id']);

return $res;