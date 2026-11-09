<?php
/**
 * Bridle demo seed for WordPress Playground: one business, docs, an inbox
 * with real-looking mail and agent drafts, Chat on, Pro's pages ready.
 */
require_once '/wordpress/wp-load.php';
wp_set_current_user( 1 );

use Bridle\Services\Settings;

// The business.
update_option( 'blogname', 'Acme Sliders' );
update_option( 'blogdescription', 'Sliders and carousels for WordPress' );
update_option( 'bridle_onboarding_done', true );
Settings::update_many(
	[
		'business_name'      => 'Acme Sliders',
		'agent_instructions' => "We sell Acme Slider Pro: $49 a year for 1 site, $99 for 5 sites. Every plan includes a year of updates and support. Refunds within 30 days, handled by a person.",
		'chat_enabled'       => true,
		'chat_greeting'      => 'Hi! Ask me anything about Acme Slider. A person can take over any time.',
	]
);

// Help docs (Bridle KB) and a pricing page.
$docs = [
	'Updates and support'          => 'Every Acme Slider Pro plan includes a year of updates and support. Renew any time from your account to keep getting updates. Your slider keeps working if you don\'t renew.',
	'Use it on a staging site'     => 'Staging and local sites don\'t count against your licence. Activate your key on staging as often as you like; only live sites count.',
	'Move to a new install'        => 'To move your settings, go to Acme Slider → Tools → Export, download the file, then import it on the new site under Tools → Import. Deactivate the licence on the old site first.',
	'Slider not showing on Safari' => 'If a slider is blank on Safari 17, clear your cache plugin and turn off "Lazy load images" under Acme Slider → Performance. Version 3.4.2 fixes this for good.',
];
foreach ( $docs as $title => $body ) {
	wp_insert_post( [ 'post_type' => post_type_exists( 'docs' ) ? 'docs' : 'page', 'post_status' => 'publish', 'post_title' => $title, 'post_content' => '<!-- wp:paragraph --><p>' . esc_html( $body ) . '</p><!-- /wp:paragraph -->' ] );
}
wp_insert_post( [ 'post_type' => 'page', 'post_status' => 'publish', 'post_title' => 'Pricing', 'post_content' => '<!-- wp:paragraph --><p>Acme Slider Pro costs $49 a year for 1 site and $99 a year for 5 sites. Every plan includes a year of updates and support.</p><!-- /wp:paragraph -->' ] );

// An inbox, the way the app makes one (the relay is stubbed).
$request = new WP_REST_Request( 'POST', '/bridle/v1/inboxes' );
$request->set_header( 'content-type', 'application/json' );
$request->set_body( wp_json_encode( [ 'display_name' => 'Support', 'email_address' => 'support@acmesliders.test' ] ) );
$inbox = rest_do_request( $request )->get_data();
$inbox = ( new Bridle\Models\Inbox() )->get_by_id( (int) ( $inbox['id'] ?? 0 ) );
Bridle\Services\InboxAiSettings::update( (int) $inbox->id, [ 'agent_mode' => 'draft' ] );
Settings::update_many( [ 'chat_inbox_id' => (int) $inbox->id ] );

// Customer mail, through the real webhook.
$mail = [
	[ 'Priya Nair', 'priya@example.com', 'Slider breaks on Safari 17', "Hi, my homepage slider is blank on Safari 17 but fine in Chrome. Any idea?\n\nPriya" ],
	[ 'Ana Silva', 'ana@example.com', 'Can I use it on a staging site?', "Hello! Does my 1-site licence also work on my staging site?\n\nThanks, Ana" ],
	[ 'Jonas Ortiz', 'jonas@example.com', 'Does the Pro plan include updates?', "Hey, if I buy Pro, do I get updates and for how long?\n\nJonas" ],
	[ 'Hannah Lindqvist', 'hannah@example.com', 'Refund for order 1187', "I bought the 5-site plan by mistake. Can I get a refund for order 1187?\n\nHannah" ],
	[ 'Leo Park', 'leo@example.com', 'Moving settings to a new install', "We're moving to a new WordPress install. How do I bring the slider settings over?\n\nLeo" ],
	[ 'Stripe', 'receipts@stripe.com', 'Your receipt from Acme Sliders #2041', 'Receipt #2041. Amount paid: $49.00.' ],
];
$i = 0;
foreach ( $mail as [ $name, $email, $subject, $text ] ) {
	$i++;
	$req = new WP_REST_Request( 'POST', '/bridle/v1/inbound-email' );
	$req->set_header( 'content-type', 'application/json' );
	$req->set_header( 'X-Bridle-Auth', $inbox->webhook_secret );
	$req->set_body(
		wp_json_encode(
			[
				'to'         => $inbox->forwarding_address,
				'from'       => $email,
				'from_name'  => $name,
				'subject'    => $subject,
				'text'       => $text,
				'html'       => wpautop( esc_html( $text ) ),
				'message_id' => "<demo-{$i}@example.com>",
			] + ( 'receipts@stripe.com' === $email ? [ 'precedence' => 'bulk', 'auto_submitted' => 'auto-generated', 'list_unsubscribe' => 'https://stripe.com/unsubscribe' ] : [] )
		)
	);
	rest_do_request( $req );
}

// The agent drafts now rather than in the background.
global $wpdb;
foreach ( $wpdb->get_col( "SELECT id FROM {$wpdb->prefix}bridle_conversations WHERE status = 'active' AND is_automated = 0" ) as $id ) {
	Bridle\Services\AgentService::draft( (int) $id );
}

echo "seeded\n";
