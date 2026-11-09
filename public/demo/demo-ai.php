<?php
/**
 * Plugin Name: Bridle demo AI (no real model: it answers from the best matching doc)
 * Description: For the bridle.to live demo in WordPress Playground. Registers a stand-in text-generation provider in the WordPress AI client, so Bridle runs end to end with no API key and no network calls. It is not a real model: it answers with the best matching passage from the KNOWLEDGE block of the prompt. With your own key, a real model writes the replies.
 *
 * Registration: on `init` priority 5, before core builds the Connectors list from
 * the AI client registry (init 15) and passes stored keys to it (init 20).
 * Every SDK class it touches is checked first, so an SDK change disables it
 * instead of breaking the site.
 */

use WordPress\AiClient\AiClient;
use WordPress\AiClient\Messages\DTO\Message;
use WordPress\AiClient\Messages\DTO\MessagePart;
use WordPress\AiClient\Messages\DTO\ModelMessage;
use WordPress\AiClient\Messages\Enums\ModalityEnum;
use WordPress\AiClient\Providers\AbstractProvider;
use WordPress\AiClient\Providers\Contracts\ModelMetadataDirectoryInterface;
use WordPress\AiClient\Providers\Contracts\ProviderAvailabilityInterface;
use WordPress\AiClient\Providers\DTO\ProviderMetadata;
use WordPress\AiClient\Providers\Enums\ProviderTypeEnum;
use WordPress\AiClient\Providers\Models\Contracts\ModelInterface;
use WordPress\AiClient\Providers\Models\DTO\ModelConfig;
use WordPress\AiClient\Providers\Models\DTO\ModelMetadata;
use WordPress\AiClient\Providers\Models\DTO\SupportedOption;
use WordPress\AiClient\Providers\Models\Enums\CapabilityEnum;
use WordPress\AiClient\Providers\Models\Enums\OptionEnum;
use WordPress\AiClient\Providers\Models\TextGeneration\Contracts\TextGenerationModelInterface;
use WordPress\AiClient\Results\DTO\Candidate;
use WordPress\AiClient\Results\DTO\GenerativeAiResult;
use WordPress\AiClient\Results\DTO\TokenUsage;
use WordPress\AiClient\Results\Enums\FinishReasonEnum;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Everything the fake needs from the SDK; if any is missing, it stays off. */
function bridle_local_fake_ai_sdk_ok(): bool {
	if ( ! function_exists( 'wp_ai_client_prompt' ) ) {
		return false;
	}
	if ( false ) { // Demo copy for the Playground: always on.
		return false;
	}

	$classes = [
		AiClient::class,
		Message::class,
		MessagePart::class,
		ModelMessage::class,
		ModalityEnum::class,
		AbstractProvider::class,
		ProviderMetadata::class,
		ProviderTypeEnum::class,
		ModelConfig::class,
		ModelMetadata::class,
		SupportedOption::class,
		CapabilityEnum::class,
		OptionEnum::class,
		Candidate::class,
		GenerativeAiResult::class,
		TokenUsage::class,
		FinishReasonEnum::class,
	];
	foreach ( $classes as $class ) {
		if ( ! class_exists( $class ) ) {
			return false;
		}
	}

	$interfaces = [
		ModelMetadataDirectoryInterface::class,
		ProviderAvailabilityInterface::class,
		ModelInterface::class,
		TextGenerationModelInterface::class,
	];
	foreach ( $interfaces as $interface ) {
		if ( ! interface_exists( $interface ) ) {
			return false;
		}
	}

	return true;
}

/**
 * The fake answer, shaped for Bridle's AgentPrompt::parse(), built from the
 * user prompt AgentPrompt::user_prompt() writes.
 */
function bridle_local_fake_ai_answer( string $prompt ): array {
	$lines = preg_split( '/\R/u', $prompt ) ?: [];

	$heading_re = '/^\[(instructions|(?:snippet|kb|product|page|post|past):[^\]\s]+)\]/u';
	$speaker_re = '/^\[[^\]]*\] (Customer|Agent \(you\)|Teammate)\b/u';

	$section  = '';
	$entries  = []; // id => text lines.
	$messages = []; // [ speaker, text lines ].
	$current  = null;
	$previous = '';

	foreach ( $lines as $line ) {
		$trim       = trim( $line );
		$after_gap  = '' === trim( $previous );
		$previous   = $line;

		if ( 'KNOWLEDGE' === $trim && '' === $section ) {
			$section = 'knowledge';
			continue;
		}
		if ( $after_gap && 'CUSTOMER' === $trim && 'knowledge' === $section ) {
			$section = 'customer';
			continue;
		}
		if ( $after_gap && 0 === strpos( $trim, 'CONVERSATION' ) && in_array( $section, [ 'knowledge', 'customer' ], true ) ) {
			$section = 'conversation';
			continue;
		}

		if ( 'knowledge' === $section ) {
			if ( $after_gap && preg_match( $heading_re, $trim, $m ) ) {
				$current             = $m[1];
				$entries[ $current ] = [];
			} elseif ( null !== $current ) {
				$entries[ $current ][] = $line;
			}
		} elseif ( 'conversation' === $section ) {
			if ( $after_gap && preg_match( $speaker_re, $trim, $m ) ) {
				$messages[] = [ $m[1], [] ];
			} elseif ( $messages ) {
				$messages[ count( $messages ) - 1 ][1][] = $line;
			}
		}
	}

	// The newest customer message; without a CONVERSATION block, the prompt's last paragraph.
	$newest = '';
	foreach ( array_reverse( $messages ) as $message ) {
		if ( 'Customer' === $message[0] ) {
			$newest = implode( "\n", $message[1] );
			break;
		}
	}
	if ( ! $messages ) {
		$paragraphs = preg_split( '/\R\s*\R/u', trim( $prompt ) ) ?: [];
		$newest     = (string) end( $paragraphs );
	}

	$flags = preg_match( '/\brefund/i', $newest ) ? [ 'refund' ] : [];

	$placeholder = class_exists( 'Bridle\Services\KnowledgeText' ) && defined( 'Bridle\Services\KnowledgeText::PLACEHOLDER_RE' )
		? \Bridle\Services\KnowledgeText::PLACEHOLDER_RE
		: '/\[(email|link|phone|number|key|ip|name)\]/i';

	foreach ( $entries as $id => $text_lines ) {
		if ( ! preg_match( '/^(kb|page|product|post):/', $id ) ) {
			continue;
		}

		$plain = html_entity_decode( wp_strip_all_tags( implode( "\n", $text_lines ) ), ENT_QUOTES | ENT_HTML5, 'UTF-8' );
		$plain = trim( (string) preg_replace( '/\s+/u', ' ', $plain ) );
		if ( '(none)' === $plain || mb_strlen( $plain ) < 40 ) {
			continue;
		}

		foreach ( preg_split( '/(?<=[.!?])\s+/u', $plain ) ?: [] as $sentence ) {
			$sentence = trim( $sentence );
			if ( mb_strlen( $sentence ) < 8 || preg_match( $placeholder, $sentence ) ) {
				continue;
			}
			if ( mb_strlen( $sentence ) > 300 ) {
				$cut      = mb_substr( $sentence, 0, 300 );
				$space    = mb_strrpos( $cut, ' ' );
				$sentence = rtrim( false !== $space && $space > 40 ? mb_substr( $cut, 0, $space ) : $cut );
			}

			return [
				'reply_html'         => '<p>' . esc_html( $sentence ) . '</p>',
				'confidence'         => 'high',
				'grounded_in'        => [
					[
						'source' => $id,
						'quote'  => $sentence,
					],
				],
				'flags'              => $flags,
				'needs_human_reason' => '',
				'summary'            => "Local fake AI answered from {$id}.",
			];
		}
	}

	return [
		'reply_html'         => '<p>Thanks for your message. A teammate will check this and get back to you.</p>',
		'confidence'         => 'low',
		'grounded_in'        => [],
		'flags'              => $flags,
		'needs_human_reason' => 'Nothing in knowledge covers this.',
		'summary'            => 'Local fake AI found nothing in knowledge for this.',
	];
}

if ( bridle_local_fake_ai_sdk_ok() ) {

	/** Always configured: no key, no network. */
	class Bridle_Local_Fake_AI_Availability implements ProviderAvailabilityInterface {
		public function isConfigured(): bool {
			return true;
		}
	}

	/** One model, "fake-chat", that accepts every option Bridle sets. */
	class Bridle_Local_Fake_AI_Directory implements ModelMetadataDirectoryInterface {
		const MODEL_ID = 'fake-chat';

		private ?ModelMetadata $model = null;

		public function listModelMetadata(): array {
			return [ $this->model() ];
		}

		public function hasModelMetadata( string $modelId ): bool {
			return self::MODEL_ID === $modelId;
		}

		public function getModelMetadata( string $modelId ): ModelMetadata {
			if ( ! $this->hasModelMetadata( $modelId ) ) {
				throw new \WordPress\AiClient\Common\Exception\InvalidArgumentException( sprintf( 'Model not found: %s', $modelId ) );
			}
			return $this->model();
		}

		private function model(): ModelMetadata {
			if ( null === $this->model ) {
				$text    = [ [ ModalityEnum::text() ] ];
				$options = [];
				$names   = [
					'systemInstruction' => null,
					'temperature'       => null,
					'maxTokens'         => null,
					'topP'              => null,
					'topK'              => null,
					'candidateCount'    => null,
					'stopSequences'     => null,
					'presencePenalty'   => null,
					'frequencyPenalty'  => null,
					'outputMimeType'    => null,
					'outputSchema'      => null,
					'customOptions'     => null,
					'inputModalities'   => $text,
					'outputModalities'  => $text,
				];
				foreach ( $names as $name => $values ) {
					try {
						$options[] = new SupportedOption( OptionEnum::$name(), $values );
					} catch ( \Throwable $e ) {
						continue; // Option renamed or dropped in a newer SDK.
					}
				}

				$this->model = new ModelMetadata(
					self::MODEL_ID,
					'Demo answers',
					[ CapabilityEnum::textGeneration(), CapabilityEnum::chatHistory() ],
					$options
				);
			}
			return $this->model;
		}
	}

	class Bridle_Local_Fake_AI_Model implements ModelInterface, TextGenerationModelInterface {
		private ModelMetadata $metadata;
		private ProviderMetadata $provider;
		private ModelConfig $config;

		public function __construct( ModelMetadata $metadata, ProviderMetadata $provider ) {
			$this->metadata = $metadata;
			$this->provider = $provider;
			$this->config   = new ModelConfig();
		}

		public function metadata(): ModelMetadata {
			return $this->metadata;
		}

		public function providerMetadata(): ProviderMetadata {
			return $this->provider;
		}

		public function setConfig( ModelConfig $config ): void {
			$this->config = $config;
		}

		public function getConfig(): ModelConfig {
			return $this->config;
		}

		public function generateTextResult( array $prompt ): GenerativeAiResult {
			$text   = self::prompt_text( $prompt );
			$answer = (string) wp_json_encode( bridle_local_fake_ai_answer( $text ), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );

			$in  = (int) ceil( strlen( $text ) / 4 );
			$out = (int) ceil( strlen( $answer ) / 4 );

			return new GenerativeAiResult(
				'bridle-fake-' . wp_generate_uuid4(),
				[ new Candidate( new ModelMessage( [ new MessagePart( $answer ) ] ), FinishReasonEnum::stop() ) ],
				new TokenUsage( $in, $out, $in + $out ),
				$this->provider,
				$this->metadata
			);
		}

		/** Text of the newest user message that holds KNOWLEDGE, else of the newest user message. */
		private static function prompt_text( array $messages ): string {
			$texts = [];
			foreach ( $messages as $message ) {
				if ( ! $message instanceof Message || ! $message->getRole()->isUser() ) {
					continue;
				}
				$parts = [];
				foreach ( $message->getParts() as $part ) {
					$value = $part->getText();
					if ( null !== $value && $part->getChannel()->isContent() ) {
						$parts[] = $value;
					}
				}
				$texts[] = implode( "\n", $parts );
			}

			foreach ( array_reverse( $texts ) as $text ) {
				if ( false !== strpos( $text, 'KNOWLEDGE' ) ) {
					return $text;
				}
			}
			return (string) end( $texts );
		}
	}

	class Bridle_Local_Fake_AI_Provider extends AbstractProvider {
		const ID = 'bridle-fake';

		protected static function createModel( ModelMetadata $modelMetadata, ProviderMetadata $providerMetadata ): ModelInterface {
			return new Bridle_Local_Fake_AI_Model( $modelMetadata, $providerMetadata );
		}

		protected static function createProviderMetadata(): ProviderMetadata {
			return new ProviderMetadata(
				self::ID,
				'Bridle demo (no real AI)',
				ProviderTypeEnum::server(),
				null,
				null, // No authentication.
				'Local testing only. Answers from the prompt, with no key and no network.'
			);
		}

		protected static function createProviderAvailability(): ProviderAvailabilityInterface {
			return new Bridle_Local_Fake_AI_Availability();
		}

		protected static function createModelMetadataDirectory(): ModelMetadataDirectoryInterface {
			return new Bridle_Local_Fake_AI_Directory();
		}
	}

	add_action(
		'init',
		static function () {
			try {
				$registry = AiClient::defaultRegistry();
				if ( ! $registry->hasProvider( Bridle_Local_Fake_AI_Provider::class ) ) {
					$registry->registerProvider( Bridle_Local_Fake_AI_Provider::class );
				}
			} catch ( \Throwable $e ) {
				// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
				error_log( 'Bridle local fake AI: ' . $e->getMessage() );
			}
		},
		5
	);
}
