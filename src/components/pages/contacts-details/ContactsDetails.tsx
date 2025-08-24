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
import {addCall, clearCalls} from '@/api/calls/calls.store';
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
        // dispatch(addCall({
        //     peerId: String(contact.id),
        //     peerName: displayName,
        //     direction: 'out',
        //     isVideo: false,
        //
        //     // пример: завершённый вызов на 30 сек
        //     status: 'completed',
        //     startedAt: Date.now() - 30_000,
        //     endedAt: Date.now(),
        //     durationSec: 30,
        //     endReason: 'user_hangup',
        //     favorite: true,
        //     note: 'Тестовая запись из ContactDetails',
        // }) as any);
        dispatch(clearCalls());

        const now = Date.now();

        const t = (msAgo: number) => now - msAgo;

        const samples = [
            // --- completed ---
            // OUT + audio (30s)
            {
                peerId: '1001',
                peerName: 'Alice Johnson',
                direction: 'out' as const,
                isVideo: false,
                status: 'completed' as const,
                startedAt: t(30_000),
                endedAt: now,
                durationSec: 30,
                endReason: 'user_hangup',
                favorite: true,
                note: 'Тест: completed OUT audio 30s',
            },
            // IN + video (5m)
            {
                peerId: '1002',
                peerName: 'Anton Petrov',
                direction: 'in' as const,
                isVideo: true,
                status: 'completed' as const,
                startedAt: t(5 * 60_000),
                endedAt: now,
                durationSec: 5 * 60,
                endReason: 'peer_hangup',
                note: 'Тест: completed IN video 5m',
                peerAvatarUrl: 'https://example.com/avatars/anton.png',
            },

            // --- missed ---
            // IN + audio (no answer, 45s ринг)
            {
                peerId: '1003',
                peerName: 'Charles Lee',
                direction: 'in' as const,
                isVideo: false,
                status: 'missed' as const,
                startedAt: t(2 * 60_000 + 45_000), // 2 мин 45 сек назад
                endedAt: t(2 * 60_000),            // звонок длился ~45s
                durationSec: 0,
                endReason: 'no_answer',
                note: 'Тест: missed IN audio',
            },
            // OUT + video (timeout)
            {
                peerId: '1004',
                peerName: 'Diana Kravets',
                direction: 'out' as const,
                isVideo: true,
                status: 'missed' as const,
                startedAt: t(10 * 60_000 + 20_000),
                endedAt: t(10 * 60_000),
                durationSec: 0,
                endReason: 'timeout',
                note: 'Тест: missed OUT video (timeout)',
            },

            // --- rejected ---
            // IN + audio (user rejected)
            {
                peerId: '1005',
                peerName: 'Eugene Moroz',
                direction: 'in' as const,
                isVideo: false,
                status: 'rejected' as const,
                startedAt: t(15 * 60_000 + 5_000),
                endedAt: t(15 * 60_000 + 5_000),
                durationSec: 0,
                endReason: 'user_rejected',
                note: 'Тест: rejected IN audio (я отклонил)',
            },
            // OUT + video (peer rejected)
            {
                peerId: '1006',
                peerName: 'Fiona Green',
                direction: 'out' as const,
                isVideo: true,
                status: 'rejected' as const,
                startedAt: t(25 * 60_000 + 7_000),
                endedAt: t(25 * 60_000 + 7_000),
                durationSec: 0,
                endReason: 'peer_rejected',
                note: 'Тест: rejected OUT video (собеседник отклонил)',
            },

            // --- canceled ---
            // OUT + audio (user canceled before connect)
            {
                peerId: '1007',
                peerName: 'George Hall',
                direction: 'out' as const,
                isVideo: false,
                status: 'canceled' as const,
                startedAt: t(40 * 60_000 + 12_000),
                endedAt: t(40 * 60_000 + 12_000),
                durationSec: 0,
                endReason: 'user_canceled',
                note: 'Тест: canceled OUT audio',
            },
            // IN + video (peer canceled)
            {
                peerId: '1008',
                peerName: 'Hanna Kim',
                direction: 'in' as const,
                isVideo: true,
                status: 'canceled' as const,
                startedAt: t(50 * 60_000 + 9_000),
                endedAt: t(50 * 60_000 + 9_000),
                durationSec: 0,
                endReason: 'peer_canceled',
                note: 'Тест: canceled IN video',
            },

            // --- ongoing ---
            // OUT + audio (идёт сейчас)
            {
                peerId: '1009',
                peerName: 'Ivan Petrov',
                direction: 'out' as const,
                isVideo: false,
                status: 'ongoing' as const,
                startedAt: t(12_000),
                // без endedAt/durationSec
                note: 'Тест: ongoing OUT audio',
            },
            // IN + video (идёт сейчас)
            {
                peerId: '1010',
                peerName: 'Julia Ortega',
                direction: 'in' as const,
                isVideo: true,
                status: 'ongoing' as const,
                startedAt: t(90_000),
                favorite: true,
                note: 'Тест: ongoing IN video (избранное)',
            },
        ];

        // samples.forEach((p) => dispatch(addCall(p) as any));
        // dispatch(addCall(samples[0]) as any);

        for (let item of samples) {
            dispatch(addCall(item) as any);
        }

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
