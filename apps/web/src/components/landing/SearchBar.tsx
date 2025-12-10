import { Box, Input } from '@chakra-ui/react';
import type { JSX } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder: string;
}

export default function SearchBar({ placeholder }: SearchBarProps): JSX.Element {
  return (
    <Box maxWidth={'600px'} mx={'auto'} mb={12}>
      <Box
        display={'flex'}
        alignItems={'center'}
        bg={'bg.card'}
        border={'1px solid'}
        borderColor={'border.default'}
        borderRadius={'12px'}
        px={4}
        transition={'all 0.3s ease'}
        _focusWithin={{
          borderColor: 'brand.blue.500',
          boxShadow: 'glow.blue',
        }}
      >
        <Input
          placeholder={placeholder}
          border={'none'}
          outline={'none'}
          bg={'transparent'}
          color={'text.primary'}
          fontSize={'0.95rem'}
          py={6}
          _placeholder={{ color: 'text.muted' }}
          _focus={{ boxShadow: 'none' }}
        />
        <Box
          as={'button'}
          bg={'transparent'}
          border={'none'}
          color={'brand.blue.500'}
          cursor={'pointer'}
          p={2}
          display={'flex'}
          alignItems={'center'}
          transition={'all 0.3s ease'}
          _hover={{ color: 'brand.blue.400' }}
        >
          <Search size={20} />
        </Box>
      </Box>
    </Box>
  );
}
