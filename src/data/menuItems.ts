
import { MenuItem } from '@/types';

export const menuItems: MenuItem[] = [
  // Appetizers
  {
    id: 'appetizer-1',
    nameEn: 'Vegetable Samosa',
    nameHi: 'सब्जी समोसा',
    description: 'Crispy pastry filled with spiced potatoes, peas, and aromatic herbs',
    price: 180,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2070&auto=format&fit=crop',
    category: 'appetizers',
    isVeg: true,
    isPopular: true,
    restaurantId: 1
  },
  {
    id: 'appetizer-2',
    nameEn: 'Chicken Tikka',
    nameHi: 'चिकन टिक्का',
    description: 'Tender chicken chunks marinated in yogurt and spices, grilled to perfection',
    price: 350,
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=2080&auto=format&fit=crop',
    category: 'appetizers',
    isVeg: false,
    isSpicy: true,
    restaurantId: 1
  },
  {
    id: 'appetizer-3',
    nameEn: 'Onion Bhaji',
    nameHi: 'प्याज भजी',
    description: 'Crispy onion fritters with chickpea flour and spices',
    price: 150,
    image: 'https://images.unsplash.com/photo-1606755656431-8d90a1c3e1cf?q=80&w=1974&auto=format&fit=crop',
    category: 'appetizers',
    isVeg: true,
    restaurantId: 2
  },
  {
    id: 'appetizer-4',
    nameEn: 'Paneer Tikka',
    nameHi: 'पनीर टिक्का',
    description: 'Soft cottage cheese cubes marinated in spices and grilled',
    price: 280,
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a252b8ec4?q=80&w=2017&auto=format&fit=crop',
    category: 'appetizers',
    isVeg: true,
    isPopular: true,
    restaurantId: 2
  },
  
  // Main Courses
  {
    id: 'item-1',
    nameEn: 'Butter Chicken',
    nameHi: 'मक्खन चिकन',
    description: 'Tender chicken cooked in a creamy tomato sauce with butter and aromatic spices',
    price: 450,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=2070&auto=format&fit=crop',
    category: 'mains',
    isVeg: false,
    isPopular: true,
    restaurantId: 1
  },
  {
    id: 'item-2',
    nameEn: 'Paneer Tikka Masala',
    nameHi: 'पनीर टिक्का मसाला',
    description: 'Marinated and grilled cottage cheese cubes in a rich tomato-based gravy',
    price: 350,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=2071&auto=format&fit=crop',
    category: 'mains',
    isVeg: true,
    isPopular: true,
    restaurantId: 1
  },
  {
    id: 'item-3',
    nameEn: 'Hyderabadi Biryani',
    nameHi: 'हैदराबादी बिरयानी',
    description: 'Fragrant basmati rice cooked with meat and aromatic spices',
    price: 550,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1974&auto=format&fit=crop',
    category: 'mains',
    isVeg: false,
    isSpicy: true,
    isPopular: true,
    restaurantId: 1
  },
  {
    id: 'main-4',
    nameEn: 'Kadai Paneer',
    nameHi: 'कड़ाई पनीर',
    description: 'Cottage cheese cooked with bell peppers in a spicy masala',
    price: 380,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=2080&auto=format&fit=crop',
    category: 'mains',
    isVeg: true,
    restaurantId: 1
  },
  {
    id: 'main-5',
    nameEn: 'Chana Masala',
    nameHi: 'छोले मसाला',
    description: 'Spicy chickpea curry with onions, tomatoes and blend of spices',
    price: 280,
    image: 'https://images.unsplash.com/photo-1612502169027-98e8639b8739?q=80&w=1974&auto=format&fit=crop',
    category: 'mains',
    isVeg: true,
    restaurantId: 2
  },
  {
    id: 'item-7',
    nameEn: 'Rogan Josh',
    nameHi: 'रोगन जोश',
    description: 'Kashmir\'s signature mutton curry with aromatic spices',
    price: 550,
    image: 'https://images.unsplash.com/photo-1613292443284-8d10ef9d4b9e?q=80&w=1974&auto=format&fit=crop',
    category: 'mains',
    isVeg: false,
    isSpicy: true,
    restaurantId: 2
  },
  {
    id: 'item-10',
    nameEn: 'Chole Bhature',
    nameHi: 'छोले भटूरे',
    description: 'Spicy chickpea curry served with deep-fried bread',
    price: 350,
    image: 'https://images.unsplash.com/photo-1626132527257-5918952e270e?q=80&w=1974&auto=format&fit=crop',
    category: 'mains',
    isVeg: true,
    isSpicy: true,
    restaurantId: 2
  },
  {
    id: 'item-11',
    nameEn: 'Pav Bhaji',
    nameHi: 'पाव भाजी',
    description: 'Spiced vegetable mash served with buttered bread rolls',
    price: 250,
    image: 'https://images.unsplash.com/photo-1606491048802-8042194acd8a?q=80&w=1974&auto=format&fit=crop',
    category: 'mains',
    isVeg: true,
    restaurantId: 2
  },
  
  // Sides
  {
    id: 'side-1',
    nameEn: 'Garlic Naan',
    nameHi: 'लहसुन नान',
    description: 'Soft leavened bread topped with garlic and cilantro',
    price: 80,
    image: 'https://images.unsplash.com/photo-1633596350799-4af61e67993c?q=80&w=1974&auto=format&fit=crop',
    category: 'sides',
    isVeg: true,
    restaurantId: 1
  },
  {
    id: 'item-8',
    nameEn: 'Tandoori Roti',
    nameHi: 'तंदूरी रोटी',
    description: 'Traditional Indian bread baked in a clay oven',
    price: 50,
    image: 'https://images.unsplash.com/photo-1626777551726-4ddd40629163?q=80&w=1974&auto=format&fit=crop',
    category: 'sides',
    isVeg: true,
    restaurantId: 2
  },
  {
    id: 'side-3',
    nameEn: 'Jeera Rice',
    nameHi: 'जीरा राइस',
    description: 'Fragrant basmati rice cooked with cumin seeds',
    price: 150,
    image: 'https://images.unsplash.com/photo-1596797038530-2c107dc1857c?q=80&w=2045&auto=format&fit=crop',
    category: 'sides',
    isVeg: true,
    restaurantId: 1
  },
  {
    id: 'side-4',
    nameEn: 'Raita',
    nameHi: 'रायता',
    description: 'Yogurt with cucumber, tomatoes and spices',
    price: 100,
    image: 'https://images.unsplash.com/photo-1589238140260-5d8b8d65d4f7?q=80&w=1974&auto=format&fit=crop',
    category: 'sides',
    isVeg: true,
    restaurantId: 2
  },
  
  // Drinks
  {
    id: 'item-9',
    nameEn: 'Mango Lassi',
    nameHi: 'आम लस्सी',
    description: 'Sweet and refreshing yogurt drink blended with ripe mangoes',
    price: 150,
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?q=80&w=1974&auto=format&fit=crop',
    category: 'drinks',
    isVeg: true,
    restaurantId: 2
  },
  {
    id: 'item-12',
    nameEn: 'Masala Chai',
    nameHi: 'मसाला चाय',
    description: 'Traditional Indian spiced tea with milk',
    price: 120,
    image: 'https://images.unsplash.com/photo-1567922045116-2a00fae2ed03?q=80&w=1974&auto=format&fit=crop',
    category: 'drinks',
    isVeg: true,
    restaurantId: 2
  },
  {
    id: 'drink-3',
    nameEn: 'Fresh Lime Soda',
    nameHi: 'फ्रेश लाइम सोडा',
    description: 'Refreshing lime soda, available in sweet or salted version',
    price: 100,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1974&auto=format&fit=crop',
    category: 'drinks',
    isVeg: true,
    restaurantId: 1
  },
  {
    id: 'drink-4',
    nameEn: 'Cold Coffee',
    nameHi: 'कोल्ड कॉफी',
    description: 'Chilled coffee blended with ice cream and milk',
    price: 180,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=1769&auto=format&fit=crop',
    category: 'drinks',
    isVeg: true,
    restaurantId: 1
  },
  
  // Desserts
  {
    id: 'item-5',
    nameEn: 'Gulab Jamun',
    nameHi: 'गुलाब जामुन',
    description: 'Deep-fried milk solids soaked in rose-flavored sugar syrup',
    price: 180,
    image: 'https://images.unsplash.com/photo-1627823201562-fed2e6d92c7e?q=80&w=2070&auto=format&fit=crop',
    category: 'desserts',
    isVeg: true,
    restaurantId: 1
  },
  {
    id: 'dessert-2',
    nameEn: 'Rasmalai',
    nameHi: 'रसमलाई',
    description: 'Soft cottage cheese patties soaked in sweetened, thickened milk',
    price: 220,
    image: 'https://images.unsplash.com/photo-1606179944777-36ebfddadb1e?q=80&w=1974&auto=format&fit=crop',
    category: 'desserts',
    isVeg: true,
    isPopular: true,
    restaurantId: 1
  },
  {
    id: 'dessert-3',
    nameEn: 'Kulfi',
    nameHi: 'कुल्फी',
    description: 'Traditional Indian ice cream in various flavors',
    price: 150,
    image: 'https://images.unsplash.com/photo-1566620618878-8610b664ea12?q=80&w=1974&auto=format&fit=crop',
    category: 'desserts',
    isVeg: true,
    restaurantId: 2
  },
  {
    id: 'dessert-4',
    nameEn: 'Jalebi',
    nameHi: 'जलेबी',
    description: 'Crispy, spiral-shaped sweet soaked in sugar syrup',
    price: 120,
    image: 'https://images.unsplash.com/photo-1616671553350-01f7b9797a c=80&w=2070&auto=format&fit=crop',
    category: 'desserts',
    isVeg: true,
    restaurantId: 2
  },
  
  // Breakfast items
  {
    id: 'item-4',
    nameEn: 'Masala Dosa',
    nameHi: 'मसाला डोसा',
    description: 'Crispy rice pancake stuffed with spiced potato filling, served with chutney and sambar',
    price: 250,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=2070&auto=format&fit=crop',
    category: 'breakfast',
    isVeg: true,
    restaurantId: 1
  },
  {
    id: 'item-6',
    nameEn: 'Dal Makhani',
    nameHi: 'दाल मखनी',
    description: 'Creamy black lentil curry cooked with butter and cream',
    price: 300,
    image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?q=80&w=2070&auto=format&fit=crop',
    category: 'mains',
    isVeg: true,
    restaurantId: 1
  }
];
