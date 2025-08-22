import React from 'react';
import { HStack, VStack, Heading, Text } from '@gluestack-ui/themed';
import BaseAvatar from '@/components/common/BaseAvatar';

type PersonProps = {
    name: string;
    email: string;
    pressed?: boolean; // <- добавили
};

const Person: React.FC<PersonProps> = ({ name, email, pressed = false }) => {
    return (
        <HStack
            px="$4"
            py="$3"
            alignItems="center"
            space="md"
            borderRadius="$lg"
            bg={pressed ? 'rgba(118, 118, 128, 0.10)' : '#F5F5F5'}
        >
            <BaseAvatar fallback="SM" size="sm" />
            <VStack flex={1}>
                <Heading size="sm" numberOfLines={1}>
                    {name}
                </Heading>
                <Text size="xs" color="$textLight500" numberOfLines={1}>
                    {email}
                </Text>
            </VStack>
        </HStack>
    );
};

export default Person;
