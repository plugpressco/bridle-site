// The four tools, as the site names them everywhere.
export const TOOLS = {
  inbox: { icon: 'i-inbox', name: 'Inbox', href: '/inbox/', claim: 'All your support email, inside WordPress.', line: 'A shared inbox for your team' },
  ai: { icon: 'i-sparkles', name: 'AI answers', href: '/ai-answers/', claim: 'The answer is written before you open the email.', line: 'Replies written from your docs' },
  chat: { icon: 'i-message', name: 'Chat', href: '/chat/', claim: 'Answers visitors on your site, day and night.', line: 'A chat that knows your docs' },
  docs: { icon: 'i-book', name: 'Docs', href: '/docs/', claim: 'A help center your customers and Bridle both read.', line: 'A help center on your own site' },
} as const;
export type ToolKey = keyof typeof TOOLS;
