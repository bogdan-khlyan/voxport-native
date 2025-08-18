// components/ContactDetails.tsx
import React from 'react';
import { Platform, KeyboardAvoidingView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
    Box, VStack, HStack, Center,
    Heading, Text, Divider,
    Badge, BadgeText,
    Avatar, AvatarFallbackText,
    Button, ButtonText, Input, InputField,
    Pressable,
    Actionsheet, ActionsheetBackdrop, ActionsheetContent,
    ActionsheetHeader, ActionsheetBody, ActionsheetItem, ActionsheetItemText,
    AlertDialog, AlertDialogBackdrop, AlertDialogContent, AlertDialogHeader,
    AlertDialogBody, AlertDialogFooter,
} from '@gluestack-ui/themed';

type Contact = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    online?: boolean;
    tags?: string[];
    note?: string;
    lastSeenAt?: string; // ISO
};

type RootStackParamList = {
    Contact: { contact: Contact };
    Meeting: { room: string };
    Chat: { contactId: string };
};

type ContactRouteParams = RootStackParamList['Contact'] | undefined;

const ContactDetails: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>() as { params?: ContactRouteParams };

    const contact = route?.params?.contact;

    // Фолбэк, если пришли без параметров
    if (!contact) {
        return (
            <Box flex={1} bg="$backgroundDark950">
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                    <Center flex={1} px="$5">
                        <VStack space="md" alignItems="center">
                            <Heading size="xl" color="$textDark50">Контакт не передан</Heading>
                            <Text color="$textDark300" textAlign="center">
                                Экран «ContactDetails» требует параметр <Text bold>contact</Text>, но он не был передан.
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

    const [note, setNote] = React.useState(contact.note ?? '');
    const [saving, setSaving] = React.useState(false);
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [confirmOpen, setConfirmOpen] = React.useState(false);

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

    const statusBadge = (
        <Badge action={contact.online ? 'success' : 'muted'} px="$2" py="$1" borderRadius="$full">
            <BadgeText>{contact.online ? 'online' : 'offline'}</BadgeText>
        </Badge>
    );

    const onStartMeeting = () => {
        const room = `vox-${contact.id}`;
        navigation.navigate('Meeting', { room });
    };

    const onMessage = () => {
        navigation.navigate('Chat', { contactId: contact.id });
    };

    const onCall = () => {
        // пример: Linking.openURL(`tel:${contact.phone}`)
    };

    const onSaveNote = async () => {
        setSaving(true);
        try {
            // TODO: вызов API сохранения заметки
            await new Promise(r => setTimeout(r, 500));
        } finally {
            setSaving(false);
        }
    };

    const onDeleteContact = async () => {
        setConfirmOpen(false);
        // TODO: удаление контакта через API
        navigation.goBack();
    };

    return (
        <Box flex={1} bg="$backgroundDark950">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <Center px="$5" pt="60">
                    <VStack w="100%" maxWidth={560} space="lg">

                        {/* Шапка */}
                        <HStack alignItems="center" justifyContent="space-between">
                            <Button variant="outline" size="sm" onPress={() => navigation.goBack()}>
                                <ButtonText>Назад</ButtonText>
                            </Button>
                            <Pressable onPress={() => setMenuOpen(true)}>
                                <Text color="$textDark300">Ещё</Text>
                            </Pressable>
                        </HStack>

                        {/* Профиль */}
                        <Center>
                            <Avatar size="xl" bg="$backgroundDark900" borderWidth={1} borderColor="$borderDark700">
                                <AvatarFallbackText>{initials}</AvatarFallbackText>
                            </Avatar>
                            <VStack alignItems="center" mt="$3" space="xs">
                                <Heading size="xl" color="$textDark50" textAlign="center">{contact.name}</Heading>
                                <Text color="$textDark300">{contact.email}</Text>
                                {contact.phone ? <Text color="$textDark400">{contact.phone}</Text> : null}
                                {statusBadge}
                            </VStack>
                        </Center>

                        {/* Быстрые действия */}
                        <HStack space="sm" justifyContent="center">
                            <Button size="lg" onPress={onMessage}>
                                <ButtonText>Написать</ButtonText>
                            </Button>
                            <Button size="lg" variant="outline" onPress={onCall} isDisabled={!contact.phone}>
                                <ButtonText>Позвонить</ButtonText>
                            </Button>
                            <Button size="lg" action="primary" onPress={onStartMeeting}>
                                <ButtonText>Встреча</ButtonText>
                            </Button>
                        </HStack>

                        <Divider bg="$borderDark700" />

                        {/* Теги (через Badge как чипы) */}
                        {!!contact.tags?.length && (
                            <VStack space="sm">
                                <Heading size="md" color="$textDark200">Теги</Heading>
                                <HStack space="sm" flexWrap="wrap">
                                    {contact.tags.map(tag => (
                                        <Badge
                                            key={tag}
                                            action="muted"
                                            bg="$backgroundDark900"
                                            borderColor="$borderDark700"
                                            borderWidth={1}
                                            px="$2"
                                            py="$1"
                                            borderRadius="$full"
                                        >
                                            <BadgeText color="$textDark300">#{tag}</BadgeText>
                                        </Badge>
                                    ))}
                                </HStack>
                            </VStack>
                        )}

                        {/* Заметка */}
                        <VStack space="sm">
                            <Heading size="md" color="$textDark200">Заметка</Heading>
                            <Input bg="$backgroundDark900" borderColor="$borderDark700">
                                <InputField
                                    value={note}
                                    onChangeText={setNote}
                                    placeholder="Добавьте заметку…"
                                    placeholderTextColor="#8b8b8b"
                                    style={{ color: 'white' }}
                                    multiline
                                />
                            </Input>
                            <HStack justifyContent="flex-end">
                                <Button size="sm" isDisabled={saving} onPress={onSaveNote}>
                                    <ButtonText>{saving ? 'Сохранение…' : 'Сохранить'}</ButtonText>
                                </Button>
                            </HStack>
                        </VStack>

                        {/* Активность */}
                        <VStack space="sm">
                            <Heading size="md" color="$textDark200">Активность</Heading>
                            {contact.lastSeenAt ? (
                                <Text color="$textDark400">
                                    Последний визит: {new Date(contact.lastSeenAt).toLocaleString()}
                                </Text>
                            ) : (
                                <Text color="$textDark500">Нет данных об активности</Text>
                            )}
                        </VStack>

                        {/* Низ страницы */}
                        <VStack space="sm" mt="$4">
                            <Button variant="outline" action="negative" onPress={() => setConfirmOpen(true)}>
                                <ButtonText>Удалить контакт</ButtonText>
                            </Button>
                        </VStack>
                    </VStack>
                </Center>
            </KeyboardAvoidingView>

            {/* Меню "Ещё" */}
            <Actionsheet isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
                <ActionsheetBackdrop />
                <ActionsheetContent>
                    <ActionsheetHeader>
                        <Heading size="md">Действия</Heading>
                    </ActionsheetHeader>
                    <ActionsheetBody>
                        <ActionsheetItem onPress={() => { /* TODO: поделиться контактом */ setMenuOpen(false); }}>
                            <ActionsheetItemText>Поделиться</ActionsheetItemText>
                        </ActionsheetItem>
                        <ActionsheetItem onPress={() => { /* TODO: экспорт */ setMenuOpen(false); }}>
                            <ActionsheetItemText>Экспорт</ActionsheetItemText>
                        </ActionsheetItem>
                        <ActionsheetItem onPress={() => { setMenuOpen(false); setConfirmOpen(true); }}>
                            <ActionsheetItemText>Удалить…</ActionsheetItemText>
                        </ActionsheetItem>
                    </ActionsheetBody>
                </ActionsheetContent>
            </Actionsheet>

            {/* Подтверждение удаления */}
            <AlertDialog isOpen={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <AlertDialogBackdrop />
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <Heading size="lg">Удалить контакт?</Heading>
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        <Text>Это действие нельзя отменить.</Text>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <HStack space="sm" justifyContent="flex-end">
                            <Button variant="outline" onPress={() => setConfirmOpen(false)}>
                                <ButtonText>Отмена</ButtonText>
                            </Button>
                            <Button action="negative" onPress={onDeleteContact}>
                                <ButtonText>Удалить</ButtonText>
                            </Button>
                        </HStack>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Box>
    );
};

export default ContactDetails;
