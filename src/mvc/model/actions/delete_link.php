<?php
$success = false;
if ( !empty($model->data['obj']) ){
  $file = BBN_DATA_PATH.'bookmarksv2.json';
  $bookmarks = json_decode(file_get_contents($file), true);
  
  if ( !empty($bookmarks) ){
    $idx = \bbn\X::search($bookmarks, [
      'url' => $model->data['obj']['url'],
      'parent' => $model->data['obj']['parent'],
    ]);
   
    if ( isset($idx) ){
      array_splice($bookmarks, $idx, 1);
      $success = file_put_contents($file, Json_encode($bookmarks, JSON_PRETTY_PRINT));
    }
  }
}  
return ['success' => $success];