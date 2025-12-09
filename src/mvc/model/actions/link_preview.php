<?php


/** @var bbn\Mvc\Model $model */
use bbn\Str;
use bbn\File\Dir;
use bbn\File\Image;
use LinkPreview\LinkPreview;

if ( isset($model->data['url'], $model->data['ref']) && Str::isUrl($model->data['url']) ){
  $linkPreview = new LinkPreview($model->data['url']);
  $parsed = $linkPreview->getParsed();
  $path = BBN_USER_PATH.'tmp/'.$model->data['ref'].'/';
  $root = \strval(time());
  Dir::createPath($path.$root);

  foreach ($parsed as $parserName => $link) {
    if ( $parserName === 'general' ){
      $r = [
        'url' => $link->getUrl(),
        'realurl' => $link->getRealUrl(),
        'title' => $link->getTitle(),
        'desc' => $link->getDescription(),
        'picture' => ''
      ];
      $img = $link->getImage();
      $pictures = $link->getPictures();
      
      if ( !\is_array($pictures) ){
        $pictures = [];
      }
      if ( !empty($img) ){
        array_unshift($pictures, $img);
      }
      foreach ( $pictures as $pic ){
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $pic);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        $saved = curl_exec($curl);
        if ( $saved && (Str::len($saved) > 1000) ){
          $new = Str::encodeFilename(basename($pic), Str::fileExt(basename($pic)));
          file_put_contents($path.$root.'/'.$new, $saved);
          
          unset($saved);
       
          $img = new Image($path.$root.'/'.$new);

          if ( $img->test() && ($img->getHeight() > 96) ){
            $img->resize(false, 96)->save();
            $r['picture'] = $root.'/'.$new;
            $r['img_path'] = $model->data['ref'].'/';
            break;
          }
        }
      }
      return ['data' => $r];
    }
  }
}