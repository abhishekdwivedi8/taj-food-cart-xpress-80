
import { MenuItem } from '@/types';

export const menuItems: MenuItem[] = [
  {
    id: 'item-1',
    nameEn: 'Butter Chicken',
    nameHi: 'मक्खन चिकन',
    description: 'Tender chicken cooked in a creamy tomato sauce with butter and aromatic spices',
    price: 450,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=2070&auto=format&fit=crop',
    category: 'main',
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
    category: 'main',
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
    category: 'main',
    isVeg: false,
    isSpicy: true,
    isPopular: true,
    restaurantId: 1
  },
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
    id: 'item-5',
    nameEn: 'Gulab Jamun',
    nameHi: 'गुलाब जामुन',
    description: 'Deep-fried milk solids soaked in rose-flavored sugar syrup',
    price: 180,
    image: 'https://images.unsplash.com/photo-1627823201562-fed2e6d92c7e?q=80&w=2070&auto=format&fit=crop',
    category: 'dessert',
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
    category: 'main',
    isVeg: true,
    restaurantId: 1
  },
  {
    id: 'item-7',
    nameEn: 'Rogan Josh',
    nameHi: 'रोगन जोश',
    description: 'Kashmir\'s signature mutton curry with aromatic spices',
    price: 550,
    image: 'https://images.unsplash.com/photo-1613292443284-8d10ef9d4b9e?q=80&w=1974&auto=format&fit=crop',
    category: 'main',
    isVeg: false,
    isSpicy: true,
    restaurantId: 2
  },
  {
    id: 'item-8',
    nameEn: 'Tandoori Roti',
    nameHi: 'तंदूरी रोटी',
    description: 'Traditional Indian bread baked in a clay oven',
    price: 50,
    image: 'https://images.unsplash.com/photo-1626777551726-4ddd40629163?q=80&w=1974&auto=format&fit=crop',
    category: 'bread',
    isVeg: true,
    restaurantId: 2
  },
  {
    id: 'item-9',
    nameEn: 'Mango Lassi',
    nameHi: 'आम लस्सी',
    description: 'Sweet and refreshing yogurt drink blended with ripe mangoes',
    price: 150,
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?q=80&w=1974&auto=format&fit=crop',
    category: 'beverage',
    isVeg: true,
    restaurantId: 2
  },
  {
    id: 'item-10',
    nameEn: 'Chole Bhature',
    nameHi: 'छोले भटूरे',
    description: 'Spicy chickpea curry served with deep-fried bread',
    price: 350,
    image: 'https://images.unsplash.com/photo-1626132527257-5918952e270e?q=80&w=1974&auto=format&fit=crop',
    category: 'main',
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
    category: 'main',
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
    category: 'beverage',
    isVeg: true,
    restaurantId: 2
  }
];
