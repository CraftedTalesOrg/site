import { Link } from '@tanstack/react-router';
import { SizableText, View, XStack, YStack } from 'tamagui';
import type { JSX } from 'react';

export default function Footer(): JSX.Element {
  return (
    <View bg={'$background'}>
      <YStack tag={'footer'} py={'$8'} borderTopWidth={1}>
        <YStack ai={'center'} jc={'center'} gap={'$4'}>
          <SizableText size={'$3'} >
            ©
            {' '}
            {new Date().getFullYear()}
            {' '}
            CraftedTales. All rights reserved.
          </SizableText>
          <XStack gap={'$6'}>
            <Link to={'/'}>
              <SizableText size={'$3'}>Privacy Policy</SizableText>
            </Link>
            <Link to={'/'}>
              <SizableText size={'$3'}>Terms of Service</SizableText>
            </Link>
          </XStack>
        </YStack>
      </YStack>
    </View>
  );
}
