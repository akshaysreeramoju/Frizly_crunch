import { Product } from './types';

export const PRODUCTS: Record<string, Product> = {
  'trial-pack': {
    id: 'trial-pack',
    name: 'Trail Mix (Trial Pack)',
    category: 'fruit',
    emoji: '🎁',
    img: '/images/products/trial-pack.jpg',
    desc: 'Can\'t decide? Try our variety trail mix to taste the best of our freeze-dried fruits. A perfect combination of 100% real fruit in one convenient pouch.',
    benefits: ['Variety of Flavours', 'Great for Tasting', '100% Natural', 'Light & Crunchy'],
    weight: '130g',
    price: 659
  },
  'custard-apple': {
    id: 'custard-apple',
    name: 'Custard Apple',
    category: 'fruit',
    emoji: '🍈',
    img: '/images/products/custard-apple.jpg',
    desc: 'Our freeze-dried custard apple captures the essence of sun-ripened fruit at its peak. Each piece delivers a concentrated burst of sweet, creamy flavour with an incredible crispy crunch. Perfect as a standalone snack or a flavourful addition to your morning cereal.',
    benefits: ['Rich in Vitamin C', 'No Added Sugar', 'No Preservatives', 'No Artificial Colours'],
    weight: '12g',
    price: 249
  },
  mango: {
    id: 'mango',
    name: 'Mango',
    category: 'fruit',
    emoji: '🥭',
    img: '/images/products/mango.jpg',
    desc: 'Experience the king of fruits in a whole new way. Our freeze-dried mango slices lock in the tropical sweetness and vibrant orange colour of premium Indian Alphonso mangoes. A natural energy boost in every crunchy bite.',
    benefits: ['Rich in Vitamin A', 'Source of Fibre', 'Natural Energy', 'No Additives'],
    weight: '50g',
    price: 269
  },
  pineapple: {
    id: 'pineapple',
    name: 'Pineapple',
    category: 'fruit',
    emoji: '🍍',
    img: '/images/products/pineapple.jpg',
    desc: 'Tangy, sweet, and utterly addictive — our freeze-dried pineapple brings tropical paradise into every pack. Rich in Vitamin C and bromelain, each piece is a burst of sunshine that supports your immunity and satisfies your snack cravings.',
    benefits: ['Rich in Vitamin C', 'Supports Immunity', 'Natural Energy', 'Bromelain Rich'],
    weight: '50g',
    price: 269
  },
  guava: {
    id: 'guava',
    name: 'Pink Guava',
    category: 'fruit',
    emoji: '🍐',
    img: '/images/products/guava.jpg',
    desc: 'A tropical gem that is often overlooked — our pink guava is freeze-dried to perfection. With its distinctive sweet-tart flavour and beautiful pink hue, it\'s one of our most loved varieties. Packed with Vitamin C and dietary fibre.',
    benefits: ['Rich in Vitamin C', 'Good Source of Fibre', 'Supports Immunity', 'Antioxidants'],
    weight: '50g',
    price: 269
  },
  jackfruit: {
    id: 'jackfruit',
    name: 'Jackfruit',
    category: 'fruit',
    emoji: '🍈',
    img: '/images/products/jackfruit.jpg',
    desc: 'India\'s national fruit, reimagined as a premium freeze-dried snack. Our jackfruit captures the unique honey-like sweetness of ripe jackfruit in each airy, crunchy piece. A great source of dietary fibre and potassium.',
    benefits: ['Good Source of Fibre', 'Rich in Potassium', 'Natural Energy', 'Unique Flavour'],
    weight: '50g',
    price: 299
  },
  banana: {
    id: 'banana',
    name: 'Banana',
    category: 'fruit',
    emoji: '🍌',
    img: '/images/products/banana.jpg',
    desc: 'The classic comfort fruit, elevated. Our freeze-dried banana slices are light, airy, and melt-in-your-mouth delicious. No deep-frying, no baking — just pure banana goodness locked in by freeze-drying technology.',
    benefits: ['Source of Vitamin C', 'No Preservatives', 'No Additives', 'Natural Sweetness'],
    weight: '50g',
    price: 159
  },
  apple: {
    id: 'apple',
    name: 'Apple',
    category: 'fruit',
    emoji: '🍎',
    img: '/images/products/apple.jpg',
    desc: 'An apple a day, the crunchy freeze-dried way! Our premium apple slices are sourced from the best orchards and freeze-dried to preserve their natural crisp flavour. Light, refreshing, and entirely guilt-free.',
    benefits: ['Source of Vitamin C', 'No Preservatives', 'Dietary Fibre', 'Pure & Natural'],
    weight: '50g',
    price: 299
  },
  papaya: {
    id: 'papaya',
    name: 'Papaya',
    category: 'fruit',
    emoji: '🟠',
    img: '/images/products/papaya.jpg',
    desc: 'Soft, sweet, and tropical — our freeze-dried papaya is a wellness powerhouse. Rich in dietary fibre and natural enzymes that support digestion, it\'s the perfect healthy snack for those who care about gut health.',
    benefits: ['Rich in Dietary Fibre', 'Supports Digestion', 'Supports Immunity', 'Enzyme Rich'],
    weight: '50g',
    price: 249
  },
  chikoo: {
    id: 'chikoo',
    name: 'Chikoo',
    category: 'fruit',
    emoji: '🟤',
    img: '/images/products/chikoo.jpg',
    desc: 'Chikoo (Sapodilla) has a uniquely sweet, caramel-like flavour that makes it one of our most distinctive offerings. Freeze-dried to perfection, it\'s a good source of dietary fibre and potassium — and utterly irresistible.',
    benefits: ['Good Source of Fibre', 'Rich in Potassium', 'Natural Energy', 'Caramel-like Taste'],
    weight: '50g',
    price: 199
  },
  amla: {
    id: 'amla',
    name: 'Amla',
    category: 'fruit',
    emoji: '🟢',
    img: '/images/products/amla.jpg',
    desc: 'The ancient Indian superfruit, now available as a premium freeze-dried snack. Amla is one of the richest natural sources of Vitamin C and has been used in Ayurvedic wellness for centuries. Tart, tangy, and incredibly nutritious.',
    benefits: ['Exceptionally Rich in Vit C', 'No Preservatives', 'Natural & Pure', 'Ayurvedic Superfruit'],
    weight: '50g',
    price: 199
  },
  carrot: {
    id: 'carrot',
    name: 'Carrot',
    category: 'vegetable',
    emoji: '🥕',
    img: '/images/products/carrot.jpg',
    desc: 'Crunchy, sweet, and full of beta-carotene. Our freeze-dried carrots retain their vibrant orange colour and natural sweetness, making them a delightful healthy snack that kids and adults equally love. Great for eye health and immunity.',
    benefits: ['Rich in Beta-Carotene', 'Good for Eye Health', 'Supports Immunity', 'Skin Health'],
    weight: '50g',
    price: 249
  },
  sweetcorn: {
    id: 'sweetcorn',
    name: 'Sweetcorn',
    category: 'vegetable',
    emoji: '🌽',
    img: '/images/products/sweetcorn.jpg',
    desc: 'Pop-like crunch with the sweet, golden flavour of freshly harvested corn. Our freeze-dried sweetcorn kernels are rich in dietary fibre and make for an incredibly satisfying snack. A crowd-pleaser for all ages.',
    benefits: ['Rich in Fibre', 'Natural Energy', 'Supports Immunity', 'No Added Salt'],
    weight: '50g',
    price: 159
  },
  beetroot: {
    id: 'beetroot',
    name: 'Beetroot',
    category: 'vegetable',
    emoji: '🟣',
    img: '/images/products/beetroot.jpg',
    desc: 'Earthy, sweet, and strikingly vibrant. Our freeze-dried beetroot is a nutritional powerhouse rich in iron that supports healthy haemoglobin levels. Its beautiful deep purple colour and unique flavour make it one of our most distinctive products.',
    benefits: ['Rich in Iron', 'Supports Haemoglobin', 'Good for Digestion', 'Antioxidant Rich'],
    weight: '50g',
    price: 249
  }
};

export const PRODUCT_LIST = Object.values(PRODUCTS);

