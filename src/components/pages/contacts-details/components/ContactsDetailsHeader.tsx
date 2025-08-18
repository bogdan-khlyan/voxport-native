// components/contacts-details/ContactDetailsHeader.tsx
import React from 'react';
import { HStack, Button, ButtonText, Pressable, Text } from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';

type Props = {
    onMenuOpen: () => void;
};

const ContactDetailsHeader: React.FC<Props> = ({ onMenuOpen }) => {
    const navigation = useNavigation<any>();

    return (
        <HStack
            px="$4"
            pt="$12"
            pb="$3"
            alignItems="center"
            justifyContent="space-between"
            borderBottomWidth={1}
            borderColor="$borderLight200"
            bg="$backgroundLight0"
        >
            <Button variant="link" onPress={() => navigation.goBack()}>
                <ButtonText>Назад</ButtonText>
            </Button>
            <Pressable onPress={onMenuOpen}>
                <Text color="$textLight500">Ещё</Text>
            </Pressable>
        </HStack>
    );
};

export default ContactDetailsHeader;
