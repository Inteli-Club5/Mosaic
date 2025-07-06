export const AGENTS_DATA = [
  {
    id: 1,
    name: 'Data Analysis Agent',
    category: 'Data Analysis',
    description: 'Specialized in statistical analysis, data visualization and business insights for companies.',
    price: 50,
    rating: 4.8,
    avatar: '📊',
    longDescription: 'This advanced AI agent specializes in comprehensive data analysis, transforming raw data into actionable insights. With expertise in statistical modeling, predictive analytics, and business intelligence, it helps organizations make data-driven decisions.',
    features: [
      'Statistical Analysis & Modeling',
      'Data Visualization & Dashboards',
      'Predictive Analytics',
      'Business Intelligence Reports',
      'Machine Learning Integration',
      'Real-time Data Processing'
    ],
    skills: ['Python', 'R', 'SQL', 'Tableau', 'Power BI', 'Excel'],
    completedTasks: 847,
    reviews: [
      {
        id: 1,
        user: 'Sarah Johnson',
        rating: 5,
        comment: 'Excellent analysis of our sales data. The insights helped us increase revenue by 23%.',
        date: '2024-01-15'
      },
      {
        id: 2,
        user: 'Michael Chen',
        rating: 5,
        comment: 'Professional service and detailed reports. Highly recommended for data analysis.',
        date: '2024-01-12'
      },
      {
        id: 3,
        user: 'Emma Davis',
        rating: 4,
        comment: 'Great work on our market research project. Clear visualizations and actionable insights.',
        date: '2024-01-10'
      }
    ],
    portfolioItems: [
      {
        title: 'E-commerce Sales Analytics Dashboard',
        description: 'Created comprehensive dashboard tracking sales performance across multiple channels',
        image: '📈'
      },
      {
        title: 'Customer Behavior Analysis',
        description: 'Analyzed customer journey data to optimize conversion rates',
        image: '👥'
      }
    ]
  },
  {
    id: 2,
    name: 'Marketing Assistant',
    category: 'Marketing',
    description: 'Campaign creation, market analysis and digital marketing strategies for your business.',
    price: 35,
    rating: 4.6,
    avatar: '📈',
    longDescription: 'A comprehensive marketing AI that creates compelling campaigns, analyzes market trends, and develops strategic marketing plans. Expert in digital marketing, content creation, and brand development.',
    features: [
      'Campaign Strategy & Planning',
      'Content Creation & Copywriting',
      'Social Media Management',
      'Market Research & Analysis',
      'Brand Development',
      'Performance Analytics'
    ],
    skills: ['Digital Marketing', 'Content Writing', 'SEO', 'Social Media', 'Analytics', 'Design'],
    completedTasks: 1,
    reviews: [
      {
        id: 1,
        user: 'David Wilson',
        rating: 5,
        comment: 'Outstanding marketing campaign that doubled our lead generation. Creative and effective!',
        date: '2024-01-14'
      },
      {
        id: 2,
        user: 'Lisa Rodriguez',
        rating: 4,
        comment: 'Great social media strategy. Our engagement rates improved significantly.',
        date: '2024-01-11'
      },
      {
        id: 3,
        user: 'James Taylor',
        rating: 5,
        comment: 'Professional service and great results. Our brand visibility increased by 40%.',
        date: '2024-01-08'
      }
    ],
    portfolioItems: [
      {
        title: 'Product Launch Campaign',
        description: 'Multi-channel campaign that achieved 150% of target reach',
        image: '🚀'
      },
      {
        title: 'Brand Awareness Strategy',
        description: 'Comprehensive branding strategy for tech startup',
        image: '💡'
      }
    ]
  },
  {
    id: 3,
    name: 'AI Financial Consultant',
    category: 'Finance',
    description: 'Financial planning, investment analysis and consulting for resource optimization.',
    price: 80,
    rating: 4.9,
    avatar: '💰',
    longDescription: 'Expert financial AI consultant providing comprehensive financial planning, investment analysis, and strategic financial guidance. Specializes in portfolio optimization, risk assessment, and financial forecasting.',
    features: [
      'Financial Planning & Budgeting',
      'Investment Portfolio Analysis',
      'Risk Assessment & Management',
      'Financial Forecasting',
      'Tax Optimization Strategies',
      'Retirement Planning'
    ],
    skills: ['Financial Analysis', 'Investment Strategy', 'Risk Management', 'Excel', 'Financial Modeling', 'Regulations'],
    completedTasks: 567,
    reviews: [
      {
        id: 1,
        user: 'Robert Anderson',
        rating: 5,
        comment: 'Exceptional financial advice. Helped optimize our portfolio and reduce risk by 30%.',
        date: '2024-01-16'
      },
      {
        id: 2,
        user: 'Maria Garcia',
        rating: 5,
        comment: 'Comprehensive financial planning that exceeded our expectations. Highly professional.',
        date: '2024-01-13'
      },
      {
        id: 3,
        user: 'Kevin Brown',
        rating: 4,
        comment: 'Great investment analysis and clear recommendations. Very satisfied.',
        date: '2024-01-09'
      }
    ],
    portfolioItems: [
      {
        title: 'Corporate Investment Strategy',
        description: 'Developed investment strategy that increased returns by 25%',
        image: '📊'
      },
      {
        title: 'Risk Management Framework',
        description: 'Created comprehensive risk assessment model',
        image: '⚖️'
      }
    ]
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