import React from 'react';
import { VStack, Heading, Text, Badge, BadgeText } from '@gluestack-ui/themed';
import BaseAvatar from '@/components/common/BaseAvatar';

type Props = {
    name: string;
    email: string;
    phone?: string;
    online?: boolean;
    initials: string;
};

const ContactProfile: React.FC<Props> = ({ name, email, phone, online, initials }) => {
    return (
        <VStack alignItems="center" py="$5" space="xs">
            <BaseAvatar fallback={initials} size="xl" />
            <Heading size="xl" mt="$2" textAlign="center">
                {name}
            </Heading>
            <Text size="sm" color="$textLight500">
                {email}
            </Text>
            {phone ? (
                <Text size="sm" color="$textLight600">
                    {phone}
                </Text>
            ) : null}
            <Badge
                action={online ? 'success' : 'muted'}
                px="$2"
                py="$1"
                borderRadius="$full"
            >
                <BadgeText>{online ? 'online' : 'offline'}</BadgeText>
            </Badge>
        </VStack>
    );
};

export default ContactProfile;
