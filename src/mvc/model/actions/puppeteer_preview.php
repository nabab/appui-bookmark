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
use bbn\File\Image;

$db = new \bbn\Db(['name' => 'test']);

$media = new bbn\Appui\Medias($db);

$res = [
  "success" => false
];

if ($model->hasData('url', true)) {
  $puppeteer = new Puppeteer;
  try {
    $browser = $puppeteer->launch([
      "defaultViewport" => [
        "width" => 1200,
        "height" => 800
      ],
      "waitForInitialPage" => false
    ]);
    $file = Str::genpwd().".png";
    $filename = $model->inc->user->getTmpDir().$file;
    $page = $browser->newPage();
    if ($page && $page->goto($model->data['url'])) {
      $screenshot = $page->screenshot(['path' => $filename]);
    }
  }
  catch (\Exception $e) {
    $res['error'] = $e->getMessage();
  }

  if ($screenshot) {
    $image = new Image($filename);
    $resize = $image->resize(320, 180, true);
    $res['image'] = $resize->toString();
    $res['success'] = true;
    $res['file'] = $file;
  }
}

return $res;