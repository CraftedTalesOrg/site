import { Text } from '@/theming/components';
import { Container } from '@chakra-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import { JSX } from 'react';
import { z } from 'zod';

const modDetailSearchSchema = z.object({
  tab: z.enum(['description', 'changelog', 'versions']).catch('description'),
});

export const Route = createFileRoute('/mods/$slug')({
  validateSearch: modDetailSearchSchema,
  component: ModDetail,
});

function ModDetail(): JSX.Element {
  return (
    <Container maxW={'container.xl'} py={8}>
      <Text variant={'sectionTitle'}>{'Test'}</Text>
    </Container>
  );
}
