import { Badge, Text, TimelineTitle, TimelineDescription } from '@/theming/components';
import { Box, Container, Timeline } from '@chakra-ui/react';
import { Check } from 'lucide-react';
import { Fragment, type JSX } from 'react';
import { useTranslation } from 'react-i18next';

export default function TimelineSection(): JSX.Element {
  const { t } = useTranslation();

  const timelineItems = [
    { key: 'ITEM_1', icon: Check },
    { key: 'ITEM_2', icon: Fragment },
    { key: 'ITEM_3', icon: Fragment },
    { key: 'ITEM_4', icon: Fragment },
    { key: 'ITEM_5', icon: Fragment },
    { key: 'ITEM_6', icon: Fragment },
  ] as const;

  return (
    <Box py={{ base: '16', md: '24' }}>
      <Container maxW={'7xl'}>
        <Box textAlign={'center'} maxWidth={'700px'} mx={'auto'} mb={16}>
          <Badge variant={'tag'} colorPalette={'blue'} mb={4}>
            {t($ => $.LANDING.TIMELINE.TAG)}
          </Badge>
          <Text variant={'sectionTitle'} mb={4}>
            {t($ => $.LANDING.TIMELINE.TITLE)}
          </Text>
          <Text variant={'subtitle'}>
            {t($ => $.LANDING.TIMELINE.SUBTITLE)}
          </Text>
        </Box>

        <Timeline.Root size={'lg'} variant={'solid'} maxW={'3xl'} mx={'auto'}>
          {timelineItems.map(item => (
            <Timeline.Item key={item.key}>
              <Timeline.Connector>
                <Timeline.Separator />
                <Timeline.Indicator>
                  <item.icon />
                </Timeline.Indicator>
              </Timeline.Connector>
              <Timeline.Content>
                <TimelineTitle>
                  {t($ => $.LANDING.TIMELINE.ITEMS[item.key].TITLE)}
                </TimelineTitle>
                <TimelineDescription>
                  {t($ => $.LANDING.TIMELINE.ITEMS[item.key].DATE)}
                </TimelineDescription>
                <Text textStyle={'sm'} mt={'2'}>
                  {t($ => $.LANDING.TIMELINE.ITEMS[item.key].DESCRIPTION)}
                </Text>
              </Timeline.Content>
            </Timeline.Item>
          ))}
        </Timeline.Root>
      </Container>
    </Box>
  );
}
