export const ROUTES = {
  HOME: '/',
  AGENTS: '/agents',
  AGENT_DETAIL: '/agents/:id',
  CREATE_AGENT: '/create',
  TEST: '/test',
  MARKETPLACE: '/marketplace',
  DOCUMENTATION: '/documentation',
  API: '/api',
  BLOG: '/blog',
  HELP: '/help',
  CONTACT: '/contact',
  FAQ: '/faq',
  PRIVACY: '/privacy',
  TERMS: '/terms'
};

export const NAV_ITEMS = [
  { path: ROUTES.HOME, label: 'Home' },
  { path: ROUTES.AGENTS, label: 'Agents' },
  { path: ROUTES.CREATE_AGENT, label: 'Register Agent' }
]; 