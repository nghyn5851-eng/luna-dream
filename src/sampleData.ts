import { Product } from './types';

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Nhẫn Bạc Stellar Glow',
    price: 850000,
    description: 'Chiếc nhẫn bạc 925 với viên đá Cubic Zirconia lấp lánh như một ngôi sao đơn độc giữa trời đêm.',
    category: 'Nhẫn tinh tú',
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
    sizes: ['5', '6', '7', '8'],
    stock: 15,
    highlighted: true
  },
  {
    id: 'p2',
    name: 'Dây Chuyền Ánh Trăng',
    price: 1250000,
    description: 'Mặt dây chuyền hình trăng khuyết tinh xảo, biểu tượng của sự huyền bí và thăng hoa.',
    category: 'Dây chuyền',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
    sizes: ['40cm', '45cm'],
    stock: 10,
    highlighted: true
  },
  {
    id: 'p3',
    name: 'Charm Thổ Tinh',
    price: 450000,
    description: 'Hàng charm bạc khắc họa hành tinh Thổ Tinh với vành đai lấp lánh, phụ kiện hoàn hảo cho vòng tay của nàng.',
    category: 'Charm hành tinh',
    imageUrl: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=800&auto=format&fit=crop',
    sizes: ['Free size'],
    stock: 20
  },
  {
    id: 'p4',
    name: 'Dây Chuyền Ngân Hà',
    price: 1850000,
    description: 'Chuỗi dây chuyền đính kết nhiều viên đá nhỏ, tạo nên dòng chảy rực rỡ như dải Ngân Hà trên cổ nàng.',
    category: 'Dây chuyền',
    imageUrl: 'https://images.unsplash.com/photo-1611085583191-a3b1a30a8a3a?q=80&w=800&auto=format&fit=crop',
    sizes: ['45cm'],
    stock: 25
  }
];
