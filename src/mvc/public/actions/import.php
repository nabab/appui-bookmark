<?php

/** @var bbn\Mvc\Controller $ctrl */

use bbn\X;

ini_set("xdebug.var_display_max_children", -1);
ini_set("xdebug.var_display_max_data", -1);
ini_set("xdebug.var_display_max_depth", -1);

use bbn\File\Image;
use bbn\Appui\Option;

class import
{
  /** @var resource $fp */
  protected $fp;
  /** @var bbn\User\Preferences $pref */
  protected $pref;
  /** @var array $res */
  protected $res = [];
  protected $parent = 9;
  protected $id_site = 'NULL';
  protected $pub = 0;
  /** @var array */
  protected $folders = [];
  /** @var string */
  protected $current_folder;
  /** @var array */
  protected $folder;
  /** @var string */
  protected $charset;
  /** @var int */
  protected $count_folders;
  /** @var int */
  protected $count_bookmarks;
  /** @var string */
  protected $name_folder;
  /** @var string */
  protected $name_bookmark;
  /** @var string */
  protected $id_option;
  /** @var string */
  protected $url;
  /** @var string */
  protected $icon;
  /** @var array */
  protected $folder_depth;
  /** @var int */
  protected $untitled;
  function __construct(bbn\User\Preferences $preferences, string $file)
  {
    /* open the importfile */
    $this->fp = fopen($file, "r");
    $this->pref = $preferences;
    $id_list = Option::getInstance()->fromCode("list", "bookmark", "appui");
    if (!($my_list = $this->pref->getByOption($id_list))) {
      $this->pref->add($id_list, []);
      $my_list = $this->pref->getByOption($id_list);
    }
    $this->id_option = $my_list['id'];

    if ($this->fp != null) {
      $this->folder = &$this->res;
      $this->parent = null;
      $this->current_folder = $this->parent;
      $this->charset = 'UTF-8';
      $this->count_folders = 0;
      $this->count_bookmarks = 0;
      $this->folder_depth = [];
      $this->untitled = 1;
    }
  }
  function import_netscape()
  {
    while (!feof($this->fp)) {
      $line = trim(fgets($this->fp));
      /* netscape seems to store html encoded values */
      $line = html_entity_decode($line, ENT_QUOTES, $this->charset);
      /* a folder has been found */
      if (preg_match("/<DT><H3/i", $line)) {
        $this->name_folder = preg_replace("/^( *<DT><[^>]*>)([^<]*)(.*)/i", "$2", $line);

        $this->folder_new();
      }
      /* a bookmark has been found */
      else if (preg_match("/<DT><A/i", $line)) {
        $this->name_bookmark = preg_replace("/^( *<DT><[^>]*>)([^<]*)(.*)/i", "$2", $line);
        $this->url = preg_replace("/([^H]*HREF=\")([^\"]*)(\".*)/i", "$2", $line);
        $icon = preg_replace("/(.*?)(ICON=\")([^\"]*)(\".*)/i", "$3", $line, -1, $num);
        $img = new Image($icon);
        $this->icon = '';
        if ($img->test()) {
          $w = $img->getWidth();
          if ($w == $img->getHeight()) {
            if ($w != 16) {
              $img->resize(16);
            }

            $this->icon = $img->toString();
          }
        }
        $this->bookmark_new();
      }
      /* this indicates, that the folder is being closed */
      else if ($line == "/</DL><p>/i") {
        $this->folder_close();
      }
    }
    if (!is_array($this->res[0]['items'])) {
      throw new \Exception(_("Invalid File"));
    }
    return [
      'id' => $this->current_folder,
      'text' => $this->res[0]['text'],
      'num_children' => count($this->res[0]['items'])
    ];
  }
  function folder_new()
  {
    if (!isset($this->name_folder)) {
      $this->name_folder = $this->untitled;
      $this->untitled++;
    }
    $id_bit = $this->pref->addBit($this->id_option, [
      'text' =>  $this->name_folder,
      'id_parent' => $this->current_folder ?: null
    ]);

    $this->parent = $this->current_folder;
    $this->current_folder = $id_bit;
    array_push($this->folder_depth, $this->current_folder);
    if (is_null($this->folder)) {
      return;
    }
    $idx = count($this->folder);
    $this->folder[] = [
      'text' => $this->name_folder,
      'items' => []
    ];
    array_push($this->folders, $this->folder);
    $this->folder = &$this->folder[$idx]['items'];
    unset($this->name_folder);
    $this->count_folders++;
  }
  function bookmark_new()
  {
    if (isset($this->name_bookmark) && isset($this->url)) {
      $this->folder[] = [
        'text' => $this->name_bookmark,
        'url' => $this->url
      ];
      $this->pref->addBit($this->id_option, [
        'text' =>  $this->name_bookmark,
        'url' => $this->url,
        'id_parent' => $this->current_folder ?: null
      ]);
    }
  }
  function folder_close()
  {
    if (count($this->folder_depth) <= 1) {
      $this->folder = &$this->res;
      $this->folder_depth = [];
      $this->current_folder = $this->parent;
    }
    else {
      /* remove the last folder from the folder history */
      array_pop($this->folder_depth);
      /* set the last folder to the current folder */
      $this->current_folder = end($this->folder_depth);
      $this->folder = &$this->folders[count($this->folders) - 1];
    }

    return $this->current_folder;
  }
}

/*$fn = function($dl, &$res = []) {
  $p = $dl->childNodes;
	//var_dump($p);
  foreach($p->childNodes as $dt) {
    //var_dump($dt->nodeName);
    if ($dt->nodeName === "dt") {
     	//var_dump($dt->nodeValue, "toto");
    }
  }
};



$dom = new DOMDocument();
$dom->loadHTML($html);
$dl = $dom->childNodes[2]->childNodes[1]->childNodes[2]->childNodes[2];
var_dump($dom->childNodes[2]->childNodes[1]->childNodes[2]->childNodes[2]);*/
/*foreach($dom->childNodes[2]->childNodes[1]->childNodes as $child) {
  var_dump($child->nodeName);
}*/
//$html = file_get_contents();

$importer = new import($ctrl->inc->pref, $ctrl->files['file']['tmp_name']);

try {
  $ctrl->obj->success = $importer->import_netscape();
}
catch (\Exception $e) {
  $ctrl->obj->error = $e->getMessage();
}

//X::hdump($res);
//var_dump($dom);
/*
foreach($dom->getElementsByTagName("a") as $i => $a) {
  //var_dump($a->getNodePath(), $a->nodeValue, $a);
  if ($a->parentNode === "(object value omitted)") {
    $res[$i] = 'test';
  }
  else {
    $res[$i] = $a->nodeValue;
  }
}
//var_dump($res);*/