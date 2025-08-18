import React from "react";
import { HStack, VStack, Pressable, Text } from "@gluestack-ui/themed";
import { ChatBubbleLeftIcon, PhoneIcon } from "react-native-heroicons/solid";

type Props = {
    onMessage: () => void;
    onCall: () => void;
    onStartMeeting: () => void;
    hasPhone: boolean;
};

const ICON_SIZE = 28;

const ActionButton: React.FC<{ icon: React.ReactNode; label: string; onPress: () => void }> = ({ icon, label, onPress }) => (
    <Pressable
        onPress={onPress}
        alignItems="center"
        justifyContent="center"
        px="$3"
        py="$4"
        bg="white"
        borderRadius={6}
        flex={1}                // одинаковая ширина
        mx="$1"
    >
        <VStack alignItems="center" space="xs">
            {icon}
            <Text size="xs" color="$textLight800">
                {label}
            </Text>
        </VStack>
    </Pressable>
);

const ContactActions: React.FC<Props> = ({ onMessage, onCall, onStartMeeting, hasPhone }) => {
    return (
        <HStack px="$2" py="$4" space="sm" justifyContent="center">
            <ActionButton
                icon={<ChatBubbleLeftIcon size={ICON_SIZE} color="#2563eb" />}
                label="Написать"
                onPress={onMessage}
            />
            {hasPhone && (
                <ActionButton
                    icon={<PhoneIcon size={ICON_SIZE} color="#16a34a" />}
                    label="Звонок"
                    onPress={onCall}
                />
            )}
            <ActionButton
                icon={<PhoneIcon size={ICON_SIZE} color="#dc2626" />}
                label="Позвонить"
                onPress={onStartMeeting}
            />
        </HStack>
    );
};

export default ContactActions;
