<?php
/**
 * Plugin Name: Bridle demo relay
 * Description: For the bridle.to live demo: the demo never registers inboxes on the real email relay. Answers /register and /deregister like the relay would.
 */
add_filter( 'pre_http_request', function ( $pre, $args, $url ) {
	if ( false === strpos( (string) $url, 'bridle-email-worker' ) ) {
		return $pre;
	}
	$body = json_decode( (string) ( $args['body'] ?? '' ), true ) ?: [];
	$out  = [ 'ok' => true ];
	if ( ! empty( $body['inbox_hash'] ) ) {
		$out['forwarding_address'] = $body['inbox_hash'] . '@bridle.to';
	}
	return [
		'headers'  => [],
		'body'     => wp_json_encode( $out ),
		'response' => [ 'code' => 200, 'message' => 'OK' ],
		'cookies'  => [],
		'filename' => null,
	];
}, 10, 3 );
