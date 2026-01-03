import { Badge, Card, Link, Text } from '@/theming/components';
import { Box, Flex, Image } from '@chakra-ui/react';
import { PublicMod } from '@craftedtales/api/schemas/mods';
import { JSX } from 'react';
import { ModStats } from './ModStats';

interface ModCardProps {
  mod: PublicMod;
}

export function ModCard({ mod }: ModCardProps): JSX.Element {
  const { name, slug, summary, owner, icon, categories } = mod;

  return (
    <Card p={0} overflow={'hidden'} height={'100%'} display={'flex'} flexDirection={'column'}>
      {/* Icon/Thumbnail Header */}
      <Box
        width={'100%'}
        height={'180px'}
        bg={'bg.secondary'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        position={'relative'}
      >
        {icon?.url
          ? (
              <Image
                src={icon.url}
                alt={name}
                objectFit={'cover'}
                width={'100%'}
                height={'100%'}
              />
            )
          : (
              <Text variant={'caption'} fontSize={'4xl'} color={'text.muted'}>
                {'?'}
              </Text>
            )}
      </Box>

      <Flex direction={'column'} justifyContent={'space-between'} flex={1}>
        {/* Content */}
        <Flex direction={'column'} p={6} gap={3}>
          {/* Categories */}
          {categories.length > 0 && (
            <Flex gap={1.5} flexWrap={'wrap'}>
              {categories.map(category => (
                <Badge key={category.id} variant={'tag'} colorPalette={'blue'}>
                  {category.name}
                </Badge>
              ))}
            </Flex>
          )}

          {/* Title */}
          <Link href={`/mods/${slug}`} color={'text.primary'} fontWeight={'bold'} fontSize={'lg'} lineClamp={2}>
            {name}
          </Link>

          {/* Owner */}
          {owner && (
            <Text variant={'caption'}>
              {'by '}
              <Link href={`/users/${owner.username}`}>
                {owner.username}
              </Link>
            </Text>
          )}

          {/* Summary */}
          <Text variant={'cardBody'} lineClamp={3} mb={2}>
            {summary}
          </Text>
        </Flex>

        {/* Stats */}
        <Flex
          mt={'auto'}
          mx={6}
          mb={6}
          gap={4}
          pt={4}
          borderTop={'1px solid'}
          borderColor={'border.default'}
          flexWrap={'wrap'}
        >
          <ModStats mod={mod} />
        </Flex>
      </Flex>
    </Card>
  );
}
