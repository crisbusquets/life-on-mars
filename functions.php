<?php
/**
 * Life on Mars Theme functions and definitions
 *
 * @package Life_on_Mars
 * @since 1.1.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Register block styles
 */
function life_on_mars_register_block_styles() {
	// Register custom image styles
	register_block_style(
		'core/image',
		array(
			'name'  => 'rounded-corners',
			'label' => __( 'Rounded Corners', 'life-on-mars' ),
		)
	);

	// Register paragraph data style
	register_block_style(
		'core/paragraph',
		array(
				'name'  => 'is-data',
				'label' => __( 'Data Style', 'life-on-mars' ),
		)
);
}
add_action( 'init', 'life_on_mars_register_block_styles' );

/**
 * Enqueue theme toggle assets
 */
function life_on_mars_enqueue_theme_toggle() {
	$theme_version = wp_get_theme()->get('Version');
	
	// Enqueue styles
	wp_enqueue_style(
			'life-on-mars-theme-toggle',
			get_theme_file_uri('assets/css/theme-toggle.css'),
			array(),
			$theme_version
	);
	
	wp_enqueue_style(
			'life-on-mars-flexoki-dark',
			get_theme_file_uri('assets/css/flexoki-dark.css'),
			array('life-on-mars-theme-toggle'),
			$theme_version
	);
	
	// Enqueue toggle script
	wp_enqueue_script(
			'life-on-mars-theme-toggle',
			get_theme_file_uri('assets/js/theme-toggle.js'),
			array(),
			$theme_version,
			true // Load in footer
	);
}
add_action('wp_enqueue_scripts', 'life_on_mars_enqueue_theme_toggle');

/**
* Add early theme initialization
*/
function life_on_mars_early_theme_init() {
	// Add inline script
	echo '<script>' . file_get_contents(get_theme_file_path('assets/js/theme-toggle-inline.js')) . '</script>';
}
add_action('wp_head', 'life_on_mars_early_theme_init', 0);