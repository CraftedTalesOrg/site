import { Badge, Card, Link, Text } from '@/theming/components';
import { Box, Flex, HStack, Image } from '@chakra-ui/react';
import { PublicMod } from '@craftedtales/api/schemas/mods';
import { JSX } from 'react';
import { ModStats } from './ModStats';

interface ModRowProps {
  mod: PublicMod;
}

export function ModRow({ mod }: ModRowProps): JSX.Element {
  const { name, slug, summary, owner, icon, categories } = mod;

  return (
    <Card p={4}>
      <Flex gap={4} direction={'column'}>
        <Flex gap={4}>
          {/* Icon */}
          <Box flexShrink={0} width={'100px'} height={'100px'} bg={'bg.secondary'} borderRadius={'md'} overflow={'hidden'} alignSelf={'center'}>
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
                  <Flex
                    width={'100%'}
                    height={'100%'}
                    alignItems={'center'}
                    justifyContent={'center'}
                  >
                    <Text variant={'caption'} fontSize={'2xl'}>
                      {'?'}
                    </Text>
                  </Flex>
                )}
          </Box>

          <Flex direction={'column'} w={'100%'}>
            <Flex align={'start'} justify={'space-between'} gap={4}>
              {/* Name, author, summary */}
              <Flex flex={2} direction={'column'} gap={2}>
                <Flex gap={3} justify={'start'} alignItems={'end'}>
                  <Link href={`/mods/${slug}`} color={'text.primary'} fontWeight={'bold'} fontSize={'lg'} lineClamp={2}>
                    {name}
                  </Link>
                  {owner && (
                    <Text variant={'caption'}>
                      {'by '}
                      <Link href={`/users/${owner.username}`}>
                        {owner.username}
                      </Link>
                    </Text>
                  )}
                </Flex>

                {/* Summary */}
                <Text variant={'cardBody'} lineClamp={2}>
                  {summary}
                </Text>
              </Flex>

              {categories.length > 0 && (
                <HStack flex={1} wrap={'wrap'} justifyContent={'end'}>
                  {categories.map(category => (
                    <Badge key={category.id}>
                      {category.name}
                    </Badge>
                  ))}
                </HStack>
              )}
            </Flex>
          </Flex>
        </Flex>

        {/* Stats */}
        <Flex gap={3} textAlign={'end'}>
          <ModStats mod={mod} />
        </Flex>
      </Flex>
    </Card>
  );
}
