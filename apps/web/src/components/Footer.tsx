import { Link } from '@tanstack/react-router';
import { Paragraph, XStack, YStack } from 'tamagui';
import type { JSX } from 'react';

export default function Footer(): JSX.Element {
  return (
    <YStack tag={'footer'} mt={'$10'} py={'$8'} borderTopWidth={1}>
      <YStack ai={'center'} jc={'center'} gap={'$4'}>
        <Paragraph size={'$3'} >
          ©
          {' '}
          {new Date().getFullYear()}
          {' '}
          CraftedTales. All rights reserved.
        </Paragraph>
        <XStack gap={'$6'}>
          <Link to={'/'}>
            <Paragraph size={'$3'}>Privacy Policy</Paragraph>
          </Link>
          <Link to={'/'}>
            <Paragraph size={'$3'}>Terms of Service</Paragraph>
          </Link>
        </XStack>
      </YStack>
    </YStack>
  );
}
