import React from 'react';
import { Box, HStack, VStack, Avatar, AvatarFallbackText, Heading, Text } from '@gluestack-ui/themed';

type PersonProps = {
    name: string;
    email: string;
};

const Person: React.FC<PersonProps> = ({ name, email }) => {
    // Берём первые буквы имени и фамилии для аватара
    const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();

    return (
        <Box
            p="$3"
            bg="$backgroundLight0"
            borderRadius="$lg"
            borderWidth={1}
            borderColor="$borderLight300"
            mb="$3"
        >
            <HStack space="md" alignItems="center">
                <Avatar size="md">
                    <AvatarFallbackText>{initials || 'NA'}</AvatarFallbackText>
                </Avatar>
                <VStack>
                    <Heading size="sm">{name}</Heading>
                    <Text color="$textLight700">{email}</Text>
                </VStack>
            </HStack>
        </Box>
    );
};

export default Person;
