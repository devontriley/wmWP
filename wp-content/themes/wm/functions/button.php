<?php
function button($text, $url = '#', $class = '', $grey = false) {
 if($text && $url) {
   echo '<a href="'. $url .'" class="btn '. ($grey === true ? 'cancel' : null) .' '. $class .'">';
   echo '<span>';
   if(strpos($class, 'share-rl') !== false){
     echo '<svg viewbox="0 0 18 15"><use xlink:href="#share-icon"></use></svg>';
   }
   echo $text .'</span></a>';
 }
}
?>
