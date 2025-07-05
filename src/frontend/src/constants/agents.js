export const AGENTS_DATA = [
  {
    id: 1,
    name: 'Agente de Análise de Dados',
    category: 'Análise de Dados',
    description: 'Especializado em análise estatística, visualização de dados e insights de negócios para empresas.',
    price: 50,
    rating: 4.8,
    avatar: '📊',
    verified: true
  },
  {
    id: 2,
    name: 'Assistente de Marketing',
    category: 'Marketing',
    description: 'Criação de campanhas, análise de mercado e estratégias de marketing digital para seu negócio.',
    price: 35,
    rating: 4.6,
    avatar: '📈',
    verified: true
  },
  {
    id: 3,
    name: 'Consultor Financeiro IA',
    category: 'Finanças',
    description: 'Planejamento financeiro, análise de investimentos e consultoria para otimização de recursos.',
    price: 80,
    rating: 4.9,
    avatar: '💰',
    verified: true
  },
  {
    id: 4,
    name: 'Desenvolvedor de Código',
    category: 'Desenvolvimento',
    description: 'Desenvolvimento de aplicações, revisão de código e consultoria técnica em diversas linguagens.',
    price: 60,
    rating: 4.7,
    avatar: '💻',
    verified: true
  },
  {
    id: 5,
    name: 'Designer Criativo',
    category: 'Design',
    description: 'Criação de designs únicos, branding e identidade visual para projetos criativos.',
    price: 45,
    rating: 4.5,
    avatar: '🎨',
    verified: false
  },
  {
    id: 6,
    name: 'Especialista em SEO',
    category: 'Marketing',
    description: 'Otimização de mecanismos de busca, análise de palavras-chave e estratégias de posicionamento.',
    price: 40,
    rating: 4.4,
    avatar: '🔍',
    verified: true
  }
];

export const CATEGORIES = [
  'Análise de Dados',
  'Marketing',
  'Finanças',
  'Desenvolvimento',
  'Design',
  'SEO',
  'Suporte',
  'Educação'
];

export const SORT_OPTIONS = [
  { value: 'popularity', label: 'Popularidade' },
  { value: 'price-low', label: 'Preço: Menor para Maior' },
  { value: 'price-high', label: 'Preço: Maior para Menor' },
  { value: 'rating', label: 'Avaliação' },
  { value: 'name', label: 'Nome' }
]; 