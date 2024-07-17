<?php
function life_on_mars_enqueue_styles() {
    wp_enqueue_style('assembler-wpcom-style', get_template_directory_uri() . '/style.css');
    wp_enqueue_style('life-on-mars-style', get_stylesheet_uri(), array('assembler-wpcom-style'));
}
add_action('wp_enqueue_scripts', 'life_on_mars_enqueue_styles');
?>