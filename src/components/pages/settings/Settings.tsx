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
            <Box bg="$background50" px="$4" pt="$6" pb="$5">
                {/* Линия с QR и "Изм." */}
                <HStack justifyContent="space-between" alignItems="center" mb="$3">
                    <Pressable onPress={() => { /* открой экран QR позже */ }}>
                        <HStack alignItems="center" space="sm" opacity={0.9}>
                            <Icon as={QrCode} size="lg" />
                        </HStack>
                    </Pressable>

                    <Pressable onPress={() => setEditMode((v) => !v)}>
                        <Text
                            style={{
                                color: '#007AFF',
                                textAlign: 'right',
                                fontSize: 17,
                                fontStyle: 'normal',
                                fontWeight: 400,
                                lineHeight: 22,
                            }}
                        >
                            {editMode ? 'Готово' : 'Изм.'}
                        </Text>
                    </Pressable>
                </HStack>

                {/* Аватар, имя, подзаголовок */}
                <VStack alignItems="center" space="xs">
                    <BaseAvatar fallback={initials(name)} size="xl"/>
                    <Heading
                        size="xl" mt="$2"
                        style={{
                            color: '#000',
                            textAlign: 'center',
                            fontSize: 25,
                            fontStyle: 'normal',
                            fontWeight: 600,
                            lineHeight: 'normal',
                        }}
                    >{name || 'Без имени'}</Heading>
                    <Text size="sm" color="$textLight500">{email || 'email не указан'}</Text>
                </VStack>
            </Box>

            {/* Кнопка выхода — скромно внизу */}
            <Box px="$4" mt="$6">
                <Button
                    variant="outline"
                    action="negative"
                    rounded="$2xl"
                    style={{
                        borderColor: 'transparent',
                        borderRadius: 12,
                        backgroundColor: 'rgba(255,59,48,0.05)',
                    }}
                    isDisabled={loading}
                    onPress={logout}
                >
                    <ButtonText style={{
                        color: '#FF3B30',
                        fontSize: 17,
                        fontStyle: 'normal',
                        fontWeight: 400,
                        lineHeight: 22,
                    }}>{loading ? 'Выход…' : 'Выйти'}</ButtonText>
                </Button>
            </Box>
        </ScrollView>
    );
}
