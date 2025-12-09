import { Box, Container, Text, Button } from '@chakra-ui/react';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

export default function CTASection(): JSX.Element {
  const { t } = useTranslation();

  return (
    <Box as={'section'} position={'relative'} zIndex={1} py={24} px={8}>
      <Container maxWidth={'900px'}>
        <Box
          bgGradient={'to-br'}
          gradientFrom={'rgba(0, 212, 255, 0.1)'}
          gradientTo={'rgba(139, 92, 246, 0.1)'}
          border={'1px solid'}
          borderColor={'border.default'}
          borderRadius={'24px'}
          p={16}
          textAlign={'center'}
          position={'relative'}
          overflow={'hidden'}
        >
          <Box
            position={'absolute'}
            top={'-50%'}
            left={'-50%'}
            width={'200%'}
            height={'200%'}
            background={'radial-gradient(circle, rgba(0, 212, 255, 0.05) 0%, transparent 50%)'}
            animation={'pulse 4s ease-in-out infinite'}
            pointerEvents={'none'}
          />
          <Box position={'relative'} zIndex={1}>
            <Text
              fontFamily={'heading'}
              fontSize={'2.5rem'}
              fontWeight={'700'}
              mb={4}
            >
              {t($ => $.LANDING.CTA.TITLE)}
            </Text>
            <Text
              color={'text.secondary'}
              fontSize={'1.1rem'}
              mb={8}
              maxWidth={'600px'}
              mx={'auto'}
            >
              {t($ => $.LANDING.CTA.DESCRIPTION)}
            </Text>
            <Button
              px={10}
              py={6}
              fontSize={'1rem'}
              bgGradient={'to-r'}
              gradientFrom={'brand.cyan.500'}
              gradientTo={'brand.purple.500'}
              color={'text.primary'}
              boxShadow={'glow.cyan'}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: '0 0 40px rgba(0, 212, 255, 0.5)',
              }}
            >
              {t($ => $.LANDING.CTA.BUTTON)}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
