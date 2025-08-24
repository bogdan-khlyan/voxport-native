// components/Person.tsx
import React, { useMemo } from 'react';
import { HStack, VStack, Heading, Text, Box } from '@gluestack-ui/themed';
import BaseAvatar from '@/components/common/BaseAvatar';
import type { User } from '@/api/user/user.service';

type PersonProps = {
    user: User;
    pressed?: boolean;
};

function getInitials(str: string) {
    const s = (str || '').trim();
    if (!s) return 'UU';
    const parts = s.split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return s.slice(0, 2).toUpperCase();
}

const Person: React.FC<PersonProps> = ({ user, pressed = false }) => {
    const { title, subtitle, initials, online } = useMemo(() => {
        const title = user.username || 'Без имени';   // username = email
        const subtitle = user.link || user.username;  // показываем link если есть
        const initials = getInitials(title);
        const online = (user as any)?.online === true; // поле пока не в типе
        return { title, subtitle, initials, online };
    }, [user]);

    return (
        <HStack
            px="$4"
            py="$3"
            alignItems="center"
            space="md"
            borderRadius="$lg"
            bg={pressed ? 'rgba(118, 118, 128, 0.10)' : '#F5F5F5'}
        >
            <Box position="relative">
                <BaseAvatar fallback={initials} size="sm" />
                {online && (
                    <Box
                        position="absolute"
                        right={-2}
                        bottom={-2}
                        w={10}
                        h={10}
                        borderRadius={9999}
                        bg="$green600"
                        borderWidth={2}
                        borderColor="#F5F5F5"
                    />
                )}
            </Box>

            <VStack flex={1} overflow="hidden">
                <Heading size="sm" numberOfLines={1}>
                    {title}
                </Heading>
                <Text size="xs" color="$textLight500" numberOfLines={1}>
                    @{subtitle}
                </Text>
            </VStack>
        </HStack>
    );
};

export default Person;
