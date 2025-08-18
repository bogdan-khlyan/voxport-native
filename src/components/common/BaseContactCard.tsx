import React, { memo } from 'react';
import { GestureResponderEvent } from 'react-native';
import { Box, HStack, VStack, Text } from '@gluestack-ui/themed';
import BaseAvatar from './BaseAvatar';
import BaseCallButton from './BaseCallButton';

export interface BaseContactCardProps {
    name: string;
    status?: string;
    avatarSrc?: string;
    avatarFallback?: string;
    onCallPress?: (event: GestureResponderEvent) => void;
}

const BaseContactCard = memo(
    ({ name, status, avatarSrc, avatarFallback, onCallPress }: BaseContactCardProps) => {
        return (
            <HStack
                bg="$backgroundLight0"
                borderWidth={1}
                borderColor="$borderLight200"
                rounded="$lg"
                p="$4"
                alignItems="center"
                justifyContent="space-between"
                space="md"
            >
                <HStack alignItems="center" space="md">
                    <BaseAvatar src={avatarSrc} fallback={avatarFallback} size="md" />
                    <VStack>
                        <Text size="md" fontWeight="$medium">
                            {name}
                        </Text>
                        {status && (
                            <Text size="sm" color="$textLight500">
                                {status}
                            </Text>
                        )}
                    </VStack>
                </HStack>

                <BaseCallButton type="answer" label="Call" onPress={onCallPress} />
            </HStack>
        );
    }
);

BaseContactCard.displayName = 'BaseContactCard';

export default BaseContactCard;

/**
 * USAGE EXAMPLE
 *
 * <BaseContactCard
 *   name="Alice Johnson"
 *   status="online"
 *   avatarSrc="https://i.pravatar.cc/100?img=11"
 *   onCallPress={() => console.log('Call Alice')}
 * />
 */
