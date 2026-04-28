export interface KitItem {
  id: string;
  name: string;
  image: string;
}

export interface Kit {
  id: string;
  name: string;
  description: string;
  price: number;
  items: KitItem[];
  image: string;
  category: string;
}
