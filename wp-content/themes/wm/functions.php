<?php

// Global variables
$template_directory = get_bloginfo('template_directory');
$image_directory = get_bloginfo('template_directory').'/images';

function load_custom_styles()
{
  wp_register_style('custom_styles', get_template_directory_uri() . '/style.css', array(), '1.0', 'all');
  wp_enqueue_style('custom_styles');
}
add_action('wp_enqueue_scripts', 'load_custom_styles');

function load_custom_scripts()
{
  if ($GLOBALS['pagenow'] != 'wp-login.php' && !is_admin()) {
    wp_register_script('jquery', get_template_directory_uri() . '/node_modules/jquery/dist/jquery.min.js', array());
    wp_enqueue_script('jquery', $src, $deps, $ver, $in_footer = true);

    wp_register_script('custom_scripts', get_template_directory_uri() . '/scripts/dist/all.js', array('jquery'), '1.0.0', true);
    wp_enqueue_script('custom_scripts', $src, $deps, $ver, $in_footer = true);
  }
}
add_action('init', 'load_custom_scripts');

include('functions/display-articles.php');
include('functions/button.php');

?>
