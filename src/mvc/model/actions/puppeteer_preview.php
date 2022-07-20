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

$minimal_args = [
  '--autoplay-policy=user-gesture-required',
  '--disable-background-networking',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-update',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-domain-reliability',
  '--disable-extensions',
  '--disable-features=AudioServiceOutOfProcess',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-notifications',
  '--disable-offer-store-unmasked-wallet-cards',
  '--disable-popup-blocking',
  '--disable-print-preview',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-setuid-sandbox',
  '--disable-speech-api',
  '--disable-sync',
  '--hide-scrollbars',
  '--ignore-gpu-blacklist',
  '--metrics-recording-only',
  '--mute-audio',
  '--no-default-browser-check',
  '--no-first-run',
  '--no-pings',
  '--no-sandbox',
  '--no-zygote',
  '--password-store=basic',
  '--use-gl=swiftshader',
  '--use-mock-keychain',
];

if ($model->hasData('url', true)) {
  $puppeteer = new Puppeteer;
  try {
    $browser = $puppeteer->launch([
      "defaultViewport" => [
        "width" => 1200,
        "height" => 800
      ],
      "waitForInitialPage" => false,
      "args" => $minimal_args,
      "headless" => true
    ]);
    $file = Str::genpwd().".png";
    $filename = $model->inc->user->getTmpDir().$file;
    $page = $browser->newPage();
    if ($page && $page->goto($model->data['url'], ['waitUntil' => 'networkidle2'])) {
      $screenshot = $page->screenshot([
        'path' => $filename,
        "type" => "jpeg"
      ]);
    }
    $page->close();
    $browser->close();
  }
  catch (\Exception $e) {
    $res['error'] = $e->getMessage();
  }

  if ($screenshot) {
    $image = new Image($filename);
    $resize = $image->resize(320, 180, true);
    $res['image'] = $resize->toString();
    unlink($filename);
    $res['success'] = true;
  }
}

return $res;