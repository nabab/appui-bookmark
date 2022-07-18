<?php
/*
 *  Describe what it does
 *
 **/

use bbn\Str;
use bbn\X;
use Dusterio\LinkPreview\Client;
use Nesk\Puphpeteer\Puppeteer;

var_dump($ctrl->getUrl(), $ctrl->inc->user->getId());

$media = new bbn\Appui\Medias($ctrl->db);
//$cfg = $ctrl->inc->pref->getClassCfg();
//$f = $cfg['arch']['user_options_bits'];
$id_option = $ctrl->inc->options->fromCode('list', 'bookmark', 'appui');

$id_user_options = $ctrl->db->getColumnValues('bbn_users_options', 'id', [
  'id_option' => $id_option
]);

$puppeteer = new Puppeteer;

try {
  $browser = $puppeteer->launch([
    "defaultViewport" => [
      "width" => 1200,
      "height" => 800
    ],
    "waitForInitialPage" => false
  ]);
} catch (\Exception $e) {
  X::adump($e->getMessage());
}

foreach ($id_user_options as $id_user_option) {
  $all = $ctrl->db->rselectAll([
    'table' => 'bbn_users_options_bits',
    'fields' => [
      'id',
      'id_option',
      'num',
      'text',
      'cover' => 'IFNULL (JSON_UNQUOTE(JSON_EXTRACT(cfg, \'$.cover\')), \'\')',
      'url' => 'IFNULL (JSON_UNQUOTE(JSON_EXTRACT(cfg, \'$.url\')), \'\')',
      'id_screenshot' => 'IFNULL (JSON_UNQUOTE(JSON_EXTRACT(cfg, \'$.id_screenshot\')), \'\')',
      'screenshot_path' => 'IFNULL (JSON_UNQUOTE(JSON_EXTRACT(cfg, \'$.screenshot_path\')), \'\')',
      "clicked" => 'IFNULL (JSON_UNQUOTE(JSON_EXTRACT(cfg, \'$.clicked\')), 0)'
    ],
    'where' => [
      'id_user_option' => $id_user_option
    ]
  ]);
  X::adump(count($all));
  foreach ($all as $bit) {
    if (!empty($bit['url'])) {
      if (!empty($bit['id_screenshot'])) {
        continue;
      }
      $filename = BBN_DATA_PATH.Str::genpwd().".png";
      try {
        $page = $browser->newPage();
        X::adump("going to " . $bit['url']);
        if ($page && $page->goto($bit['url'])) {
          if ($page->screenshot(['path' => $filename])) {
            /*if ($id_media = $media->insert($filename, [], $bit['text'] ?: "")) {
            $bit['path'] = $media->getPath($id_media);
            $bit['id_screenshot'] = $id_media;
            $model->inc->pref->updateBit($bit['id'], $bit, true);
            $browser->close();
            $res['success'] = true;
            $res['data'] = $bit;
          }*/
          }
        }
      } catch(Exception $e) {
				X::adump($e->getMessage());
      }
    }
  }
}