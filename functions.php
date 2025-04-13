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
 * Sets up theme defaults and registers support for various WordPress features.
 */
function life_on_mars_setup() {
	// Add support for block styles.
	add_theme_support( 'wp-block-styles' );
	
	// Register block pattern categories.
	if ( function_exists( 'register_block_pattern_category' ) ) {
		register_block_pattern_category(
			'life-on-mars',
			array( 'label' => __( 'Life on Mars', 'life-on-mars' ) )
		);
	}
	
	// Add support for responsive embeds
	add_theme_support( 'responsive-embeds' );
	
	// Load translations
	load_theme_textdomain( 'life-on-mars', get_template_directory() . '/languages' );
}
add_action( 'after_setup_theme', 'life_on_mars_setup' );

/**
 * Register block patterns
 */
function life_on_mars_register_block_patterns() {
	// Only register patterns if the pattern functions exist
	if ( function_exists( 'register_block_pattern' ) ) {
		// Get pattern files from the patterns directory
		$pattern_directory = get_template_directory() . '/patterns/';
		
		if ( is_dir( $pattern_directory ) ) {
			$pattern_files = glob( $pattern_directory . '*.php' );
			
			if ( $pattern_files ) {
				foreach ( $pattern_files as $pattern_file ) {
					$pattern = require $pattern_file;
					if ( is_array( $pattern ) && isset( $pattern['title'] ) && isset( $pattern['content'] ) ) {
						register_block_pattern(
							'life-on-mars/' . basename( $pattern_file, '.php' ),
							$pattern
						);
					}
				}
			}
		}
	}
}
add_action( 'init', 'life_on_mars_register_block_patterns' );

/**
 * Enqueue editor assets
 */
function life_on_mars_editor_assets() {
	// Add custom styles to the editor
	$editor_style_path = get_theme_file_path( 'assets/css/editor-style.css' );
	
	// Only enqueue if the file exists
	if ( file_exists( $editor_style_path ) ) {
		wp_enqueue_style(
			'life-on-mars-editor-styles',
			get_theme_file_uri( 'assets/css/editor-style.css' ),
			array(),
			filemtime( $editor_style_path )
		);
	}
}
add_action( 'enqueue_block_editor_assets', 'life_on_mars_editor_assets' );

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