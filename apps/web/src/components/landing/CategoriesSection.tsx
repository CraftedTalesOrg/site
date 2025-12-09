import { YStack } from 'tamagui';
import type { JSX } from 'react';
import {
  Blocks,
  Boxes,
  Code2,
  Image,
  Package,
  Puzzle,
  Users,
  Zap,
} from 'lucide-react';
import { CategoryCard } from './CategoryCard';
import { SectionHeader } from '../SectionHeader';

const categories = [
  { icon: <Puzzle size={32} color={'var(--accent)'} />, name: 'Mods', count: 1234 },
  { icon: <Package size={32} color={'var(--accent)'} />, name: 'Plugins', count: 567 },
  { icon: <Image size={32} color={'var(--accent)'} />, name: 'Resource Packs', count: 890 },
  { icon: <Boxes size={32} color={'var(--accent)'} />, name: 'Modpacks', count: 234 },
  { icon: <Zap size={32} color={'var(--accent)'} />, name: 'Shaders', count: 123 },
  { icon: <Blocks size={32} color={'var(--accent)'} />, name: 'Maps', count: 456 },
  { icon: <Code2 size={32} color={'var(--accent)'} />, name: 'Tools', count: 78 },
  { icon: <Users size={32} color={'var(--accent)'} />, name: 'Server Plugins', count: 345 },
];

export function CategoriesSection(): JSX.Element {
  return (
    <YStack bg={'$backgroundSubtle'} py={'$12'} px={'$4'}>
      <SectionHeader
        tag={'Categories'}
        title={'Explore by Category'}
        subtitle={'Find exactly what you\'re looking for in our organized collection.'}
      />
      <YStack
        maxWidth={1200}
        mx={'auto'}
        width={'100%'}
        gridTemplateColumns={'repeat(4, 1fr)'}
        gap={'$4'}
        style={{ display: 'grid' }}
      >
        {categories.map(category => (
          <CategoryCard
            key={category.name}
            icon={category.icon}
            name={category.name}
            count={category.count}
          />
        ))}
      </YStack>
    </YStack>
  );
}
