import React from 'react';
import { Platform, KeyboardAvoidingView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
    Box, VStack, Center,
    Heading, Text,
    Button, ButtonText,
    Pressable,
    Actionsheet, ActionsheetBackdrop, ActionsheetContent,
} from '@gluestack-ui/themed';
import ContactDetailsHeader from "./components/ContactsDetailsHeader";
import ContactProfile from "./components/ContactProfile";
import ContactActions from "./components/ContactActions";

type Contact = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    online?: boolean;
};

type ContactRouteParams = { contact: Contact };

const AVATAR_INSET = 72;

const ContactDetails: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>() as { params?: ContactRouteParams };

    const contact = route.params?.contact;

    if (!contact) {
        return (
            <Box flex={1} bg="$backgroundLight">
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                    <Center flex={1} px="$5">
                        <VStack space="md" alignItems="center">
                            <Heading size="xl">Контакт не передан</Heading>
                            <Text textAlign="center">
                                Экран <Text bold>ContactDetails</Text> требует параметр <Text bold>contact</Text>, но он не был передан.
                            </Text>
                            <Button onPress={() => navigation.goBack()}>
                                <ButtonText>Назад</ButtonText>
                            </Button>
                        </VStack>
                    </Center>
                </KeyboardAvoidingView>
            </Box>
        );
    }

    const [menuOpen, setMenuOpen] = React.useState(false);

    const initials = React.useMemo(
        () =>
            contact.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase() || 'NA',
        [contact.name]
    );

    const onStartMeeting = () => {
        const room = `vox-${contact.id}`;
        navigation.navigate('Meeting', { room });
    };

    const onMessage = () => navigation.navigate('Chat', { contactId: contact.id });

    const onCall = () => { /* Linking.openURL(`tel:${contact.phone}`) */ };

    const onDeleteContact = () => {
        // TODO: вызов API удаления
        navigation.goBack();
    };

    const confirmDelete = () => {
        Alert.alert(
            'Удалить контакт?',
            'Это действие нельзя отменить.',
            [
                { text: 'Отмена', style: 'cancel' },
                { text: 'Удалить', style: 'destructive', onPress: onDeleteContact },
            ]
        );
    };

    return (
        <Box flex={1} bg="$backgroundLight">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                {/* Топ-бар */}
                <ContactDetailsHeader onMenuOpen={() => setMenuOpen(true)} />

                <Center px="$4">
                    <VStack w="100%" maxWidth={560}>
                        {/* Профиль */}
                        <ContactProfile
                            name={contact.name}
                            email={contact.email}
                            phone={contact.phone}
                            online={contact.online}
                            initials={initials}
                        />

                        {/* Разделитель */}
                        <Box height={1} bg="$borderLight200" />

                        {/* Быстрые действия */}
                        <ContactActions
                            onMessage={onMessage}
                            onCall={onCall}
                            onStartMeeting={onStartMeeting}
                            hasPhone={!!contact.phone}
                        />

                    </VStack>
                </Center>
            </KeyboardAvoidingView>

            {/* Меню "Ещё" */}
            <Actionsheet isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
                <ActionsheetBackdrop />
                <ActionsheetContent>
                    <VStack p="$4" space="md">
                        <Heading size="md">Действия</Heading>

                        <Pressable onPress={() => { setMenuOpen(false); /* поделиться */ }}>
                            <Text>Поделиться</Text>
                        </Pressable>

                        <Pressable onPress={() => { setMenuOpen(false); /* экспорт */ }}>
                            <Text>Экспорт</Text>
                        </Pressable>

                        <Pressable onPress={() => { setMenuOpen(false); confirmDelete(); }}>
                            <Text color="$red600">Удалить…</Text>
                        </Pressable>
                    </VStack>
                </ActionsheetContent>
            </Actionsheet>
        </Box>
    );
};

export default ContactDetails;
