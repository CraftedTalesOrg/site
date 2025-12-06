import { Paragraph, styled, YStack } from 'tamagui';

export const SectionTag = styled(YStack, {
  name: 'SectionTag',
  paddingVertical: '$2',
  paddingHorizontal: '$4',
  backgroundColor: '$backgroundStrong',
  borderRadius: '$10',
  alignSelf: 'center',
});

export const TagText = styled(Paragraph, {
  name: 'TagText',
  size: '$2',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: 1,
  color: '$accent',
});
