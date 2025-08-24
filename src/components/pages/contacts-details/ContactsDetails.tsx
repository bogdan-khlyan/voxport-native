// ContactDetails.tsx
import React from 'react';
import { Platform, KeyboardAvoidingView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
    Box, VStack, Center, Heading, Text, Button, ButtonText,
    Pressable, Actionsheet, ActionsheetBackdrop, ActionsheetContent,
    HStack, Spinner,
} from '@gluestack-ui/themed';

import ContactDetailsHeader from './components/ContactsDetailsHeader';
import ContactProfile from './components/ContactProfile';
import ContactActions from './components/ContactActions';

import { useUserStore } from '@/api/user/user.store';
import type { User } from '@/api/user/user.service';

// ✅ используем thunk-и из slice-only стора
import { addCall } from '@/api/calls/calls.store';
import { useDispatch } from 'react-redux';

type ContactRouteParams = {
    contact?: User;
    contactId?: number;
};

const ContactDetails: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>() as { params?: ContactRouteParams };
    const { user, hydrating, loading } = useUserStore();

    const dispatch = useDispatch();
    const [menuOpen, setMenuOpen] = React.useState(false);

    const rawContact = route.params?.contact;
    const routeId = route.params?.contactId ?? rawContact?.id;

    const storeContact = React.useMemo<User | undefined>(() => {
        if (!routeId) return undefined;
        const list = user?.users ?? [];
        return list.find(u => String(u.id) === String(routeId));
    }, [user, routeId]);

    const contact = storeContact ?? rawContact;

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

    const displayName = contact.username || contact.link || `#${contact.id}`;
    const handle = contact.link ? `@${contact.link.replace(/^@/, '')}` : '';
    const isOnline = (contact as any).online ?? false;

    const initials = React.useMemo(() => {
        const parts = (displayName || '').trim().split(/\s+/);
        const init = (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
        return (init || displayName.slice(0, 2) || 'NA').toUpperCase();
    }, [displayName]);

    const onStartMeeting = () => {
        // const room = `vox-${contact.id}`;
        // navigation.navigate('Meeting', { room });
    };

    const onMessage = () => navigation.navigate('ChatsTab');

    // ▶ запись в историю звонков через dispatch(thunk)
    const onCall = React.useCallback(() => {
        console.log('!!!!')
        dispatch(addCall({
            peerId: String(contact.id),
            peerName: displayName,
            direction: 'out',
            isVideo: false,

            // пример: завершённый вызов на 30 сек
            status: 'completed',
            startedAt: Date.now() - 30_000,
            endedAt: Date.now(),
            durationSec: 30,
            endReason: 'user_hangup',
            favorite: true,
            note: 'Тестовая запись из ContactDetails',
        }) as any); // если TS ругается на generic-и toolkit — можно оставить as any
    }, [dispatch, contact.id, displayName]);

    const onDeleteContact = () => {
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
                <ContactDetailsHeader onMenuOpen={() => setMenuOpen(true)} />

                <Center px="$4">
                    <VStack w="100%" maxWidth={560}>
                        <ContactProfile
                            name={displayName}
                            email={handle}
                            phone={undefined}
                            online={isOnline}
                            initials={initials}
                        />

                        <Box height={1} bg="$borderLight200" />

                        <ContactActions
                            onMessage={onMessage}
                            onCall={onCall}
                            onStartMeeting={onStartMeeting}
                            hasPhone={true}
                        />
                    </VStack>
                </Center>
            </KeyboardAvoidingView>

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
