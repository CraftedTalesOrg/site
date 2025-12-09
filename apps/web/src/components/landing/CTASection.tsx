import { Button, H2, Paragraph, YStack } from 'tamagui';
import type { JSX } from 'react';

export function CTASection(): JSX.Element {
  return (
    <YStack py={'$12'} px={'$4'}>
      <YStack
        maxWidth={900}
        mx={'auto'}
        w={'100%'}
        bg={'$backgroundStrong'}
        borderWidth={1}
        borderColor={'$borderColor'}
        borderRadius={'$6'}
        p={'$10'}
        ai={'center'}
        gap={'$6'}
        position={'relative'}
        overflow={'hidden'}
      >
        {/* Gradient overlay */}
        <YStack
          position={'absolute'}
          top={0}
          left={0}
          right={0}
          bottom={0}
          opacity={0.1}
          style={{
            background: 'radial-gradient(circle at center, var(--accent) 0%, transparent 70%)',
          }}
        />

        <YStack zIndex={1} ai={'center'} gap={'$4'}>
          <H2 size={'$9'} fontWeight={'700'} textAlign={'center'}>
            {'Ready to Share Your Creation?'}
          </H2>
          <Paragraph size={'$5'} color={'$mutedForeground'} textAlign={'center'} maxWidth={600}>
            {'Join thousands of creators and share your mods with the CraftedTales community. It\'s free and takes less than a minute.'}
          </Paragraph>
        </YStack>

        <Button
          size={'$5'}
          bg={'$primary'}
          color={'white'}
          px={'$10'}
          zIndex={1}
          shadowColor={'$accent'}
          shadowRadius={30}
          shadowOpacity={0.4}
          hoverStyle={{ bg: '$primaryHover', transform: 'translateY(-2px)' }}
        >
          {'Start Creating'}
        </Button>
      </YStack>
    </YStack>
  );
}
