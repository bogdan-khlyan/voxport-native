// components/pages/settings/Settings.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Box,
    VStack,
    HStack,
    Heading,
    Text,
    Button,
    ButtonText,
    Input,
    InputField,
    Avatar,
    AvatarFallbackText,
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    FormControlError,
    FormControlErrorText,
    Icon,
} from '@gluestack-ui/themed';
import { QrCode } from 'lucide-react-native';

import { useUserStore, STORAGE_KEYS } from '@/api/user/user.store';
import BaseAvatar from "@/components/common/BaseAvatar";

const initials = (name?: string) =>
    (name || 'User')
        .split(' ')
        .map((p) => p[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();

export default function Settings() {
    const { profile, patchProfile, logout, loading } = useUserStore();

    // редактируемые значения
    const [name, setName] = useState<string>(profile?.name ?? '');
    const [email, setEmail] = useState<string>(profile?.email ?? '');
    const [savingProfile, setSavingProfile] = useState(false);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        setName(profile?.name ?? '');
        setEmail(profile?.email ?? '');
    }, [profile?.name, profile?.email]);

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameErr = useMemo(() => (name.trim().length < 2 ? 'Минимум 2 символа' : ''), [name]);
    const emailErr = useMemo(() => (!EMAIL_RE.test(email.trim()) ? 'Некорректный email' : ''), [email]);
    const profileValid = !nameErr && !emailErr && !!name && !!email;

    const saveProfile = async () => {
        if (!profileValid || savingProfile) return;
        try {
            setSavingProfile(true);
            const next = { name: name.trim(), email: email.trim().toLowerCase() };
            patchProfile(next);
            const updated = { ...(profile ?? { id: 'unknown' }), ...next };
            await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
            setEditMode(false);
        } finally {
            setSavingProfile(false);
        }
    };

    const cancelEdit = () => {
        setName(profile?.name ?? '');
        setEmail(profile?.email ?? '');
        setEditMode(false);
    };

    const handleChangePhoto = () => {
        // тут позже подключишь выбор/съемку фото
        // сейчас — заглушка
    };

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 24, paddingTop: 60 }}>
            {/* Верхняя "шапка" как в Telegram */}
            <Box bg="$background50" px="$4" pt="$6" pb="$5" borderBottomWidth="$1" borderColor="$borderLight200">
                {/* Линия с QR и "Изм." */}
                <HStack justifyContent="space-between" alignItems="center" mb="$3">
                    <Pressable onPress={() => { /* открой экран QR позже */ }}>
                        <HStack alignItems="center" space="sm" opacity={0.9}>
                            <Icon as={QrCode} size="lg" />
                        </HStack>
                    </Pressable>

                    <Pressable onPress={() => setEditMode((v) => !v)}>
                        <Text size="md" color="$primary700">{editMode ? 'Готово' : 'Изм.'}</Text>
                    </Pressable>
                </HStack>

                {/* Аватар, имя, подзаголовок */}
                <VStack alignItems="center" space="xs">
                    <BaseAvatar fallback={initials(name)} size="xl"/>
                    <Heading size="xl" mt="$2">{name || 'Без имени'}</Heading>
                    <Text size="sm" color="$textLight500">{email || 'email не указан'}</Text>
                </VStack>
            </Box>

            {/* Кнопка "Изменить фотографию" — как плитка */}
            <Box px="$4" pt="$3">
                <Pressable onPress={handleChangePhoto}>
                    <Box
                        bg="$background0"
                        borderWidth="$1"
                        borderColor="$borderLight300"
                        rounded="$2xl"
                        px="$4"
                        py="$3"
                    >
                        <Text size="md" color="$primary700">Изменить фотографию</Text>
                    </Box>
                </Pressable>
            </Box>

            {/* Редактирование полей (показываем только в editMode) */}
            {editMode && (
                <Box px="$4" mt="$4">
                    <VStack space="md">
                        <FormControl isInvalid={!!nameErr}>
                            <FormControlLabel>
                                <FormControlLabelText>Имя</FormControlLabelText>
                            </FormControlLabel>
                            <Input>
                                <InputField
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Как к тебе обращаться"
                                    autoCapitalize="words"
                                    returnKeyType="next"
                                />
                            </Input>
                            {nameErr ? (
                                <FormControlError>
                                    <FormControlErrorText>{nameErr}</FormControlErrorText>
                                </FormControlError>
                            ) : null}
                        </FormControl>

                        <FormControl isInvalid={!!emailErr}>
                            <FormControlLabel>
                                <FormControlLabelText>Email</FormControlLabelText>
                            </FormControlLabel>
                            <Input>
                                <InputField
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="you@example.com"
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    returnKeyType="done"
                                />
                            </Input>
                            {emailErr ? (
                                <FormControlError>
                                    <FormControlErrorText>{emailErr}</FormControlErrorText>
                                </FormControlError>
                            ) : null}
                        </FormControl>

                        <HStack space="sm">
                            <Button
                                variant="solid"
                                action="primary"
                                rounded="$2xl"
                                isDisabled={!profileValid || savingProfile}
                                onPress={saveProfile}
                            >
                                <ButtonText>{savingProfile ? 'Сохраняю…' : 'Сохранить'}</ButtonText>
                            </Button>
                            <Button variant="outline" rounded="$2xl" onPress={cancelEdit}>
                                <ButtonText>Отмена</ButtonText>
                            </Button>
                        </HStack>
                    </VStack>
                </Box>
            )}

            {/* Кнопка выхода — скромно внизу */}
            <Box px="$4" mt="$6">
                <Button
                    variant="outline"
                    action="negative"
                    rounded="$2xl"
                    isDisabled={loading}
                    onPress={logout}
                >
                    <ButtonText>{loading ? 'Выход…' : 'Выйти'}</ButtonText>
                </Button>
            </Box>
        </ScrollView>
    );
}
