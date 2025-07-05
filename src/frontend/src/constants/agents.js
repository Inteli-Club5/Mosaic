export const AGENTS_DATA = [
  {
    id: 1,
    name: 'Data Analysis Agent',
    category: 'Data Analysis',
    description: 'Specialized in statistical analysis, data visualization and business insights for companies.',
    price: 50,
    rating: 4.8,
    avatar: '📊',
    verified: true
  },
  {
    id: 2,
    name: 'Marketing Assistant',
    category: 'Marketing',
    description: 'Campaign creation, market analysis and digital marketing strategies for your business.',
    price: 35,
    rating: 4.6,
    avatar: '📈',
    verified: true
  },
  {
    id: 3,
    name: 'AI Financial Consultant',
    category: 'Finance',
    description: 'Financial planning, investment analysis and consulting for resource optimization.',
    price: 80,
    rating: 4.9,
    avatar: '💰',
    verified: true
  }
];

export const CATEGORIES = [
  'Data Analysis',
  'Marketing',
  'Finance',
  'Development',
  'Design',
  'SEO',
  'Support',
  'Education'
];

export const SORT_OPTIONS = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Rating' },
  { value: 'name', label: 'Name' }
]; 