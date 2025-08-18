import React from 'react';
import { HStack, Button, ButtonText } from '@gluestack-ui/themed';

type Props = {
    onMessage: () => void;
    onCall: () => void;
    onStartMeeting: () => void;
    phone?: string;
};

const ContactActions: React.FC<Props> = ({ onMessage, onCall, onStartMeeting, phone }) => {
    return (
        <HStack px="$2" py="$3" space="sm" justifyContent="center">
            <Button size="md" onPress={onMessage}>
                <ButtonText>Написать</ButtonText>
            </Button>
            <Button size="md" variant="outline" onPress={onCall} isDisabled={!phone}>
                <ButtonText>Позвонить</ButtonText>
            </Button>
            <Button size="md" variant="outline" onPress={onStartMeeting}>
                <ButtonText>Встреча</ButtonText>
            </Button>
        </HStack>
    );
};

export default ContactActions;
