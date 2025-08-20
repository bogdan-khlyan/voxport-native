import React from 'react';
import { HStack, VStack, Avatar, AvatarFallbackText, Heading, Text } from '@gluestack-ui/themed';
import BaseAvatar from "@/components/common/BaseAvatar";

type PersonProps = {
    name: string;
    email: string;
};

const Person: React.FC<PersonProps> = ({ name, email }) => {
    const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();

    return (
        <HStack
            px="$4"
            py="$3"
            alignItems="center"
            space="md"
            backgroundColor="#F5F5F5"
            borderRadius="$lg"
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
