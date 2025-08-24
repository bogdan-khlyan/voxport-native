// ContactDetails.tsx
import React from 'react';
import { Platform, KeyboardAvoidingView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
    Box, VStack, Center,
    Heading, Text,
    Button, ButtonText,
    Pressable,
    Actionsheet, ActionsheetBackdrop, ActionsheetContent,
    HStack, Spinner,
} from '@gluestack-ui/themed';

import ContactDetailsHeader from './components/ContactsDetailsHeader';
import ContactProfile from './components/ContactProfile';
import ContactActions from './components/ContactActions';

import { useUserStore } from '@/api/user/user.store';
import type { User } from '@/api/user/user.service';

type ContactRouteParams = {
    contact?: User;      // можем передать сразу объект
    contactId?: number;  // или только id — достанем из стора
};

const ContactDetails: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>() as { params?: ContactRouteParams };

    const { user, hydrating, loading } = useUserStore();

    const [menuOpen, setMenuOpen] = React.useState(false);

    // --- достаём "сырой" контакт из параметров
    const rawContact = route.params?.contact;
    const routeId = route.params?.contactId ?? rawContact?.id;

    // --- ищем актуальную версию контакта в сторах по id
    const storeContact = React.useMemo<User | undefined>(() => {
        if (!routeId) return undefined;
        const list = user?.users ?? [];
        return list.find(u => String(u.id) === String(routeId));
    }, [user, routeId]);

    // --- финальный контакт (актуальный из стора, иначе в параметрах)
    const contact = storeContact ?? rawContact;

    // --- состояния отсутствия данных
    if (hydrating || loading) {
        return (
            <Box flex={1} bg="$backgroundLight">
                <Center flex={1}>
                    <HStack space="sm" alignItems="center">
                        <Spinner accessibilityLabel="Загрузка" />
                        <Text>Загружаем контакт…</Text>
                    </HStack>
                </Center>
            </Box>
        );
    }

    if (!contact) {
        return (
            <Box flex={1} bg="$backgroundLight">
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                    <Center flex={1} px="$5">
                        <VStack space="md" alignItems="center">
                            <Heading size="xl">Контакт не найден</Heading>
                            <Text textAlign="center">
                                Экран <Text bold>ContactDetails</Text> ожидает <Text bold>contact</Text> или <Text bold>contactId</Text>.
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

    // --- отображаемые поля
    const displayName = contact.username || contact.link || `#${contact.id}`;
    const handle = contact.link ? `@${contact.link.replace(/^@/, '')}` : '';
    const isOnline = (contact as any).online ?? false;

    const initials = React.useMemo(() => {
        const parts = (displayName || '').trim().split(/\s+/);
        const init = (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
        return (init || displayName.slice(0, 2) || 'NA').toUpperCase();
    }, [displayName]);

    const onStartMeeting = () => {
        const room = `vox-${contact.id}`;
        navigation.navigate('Meeting', { room });
    };

    const onMessage = () => navigation.navigate('Chat', { contactId: contact.id });

    const onCall = () => { /* Linking.openURL(`tel:${phone}`) */ };

    const onDeleteContact = () => {
        // TODO: вызов API удаления (по contact.id)
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
                            name={displayName}
                            email={handle}         // показываем @vox как «email/хэндл»
                            phone={undefined}      // телефона пока нет в User
                            online={isOnline}
                            initials={initials}
                        />

                        {/* Разделитель */}
                        <Box height={1} bg="$borderLight200" />

                        {/* Быстрые действия */}
                        <ContactActions
                            onMessage={onMessage}
                            onCall={onCall}
                            onStartMeeting={onStartMeeting}
                            hasPhone={false}
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
