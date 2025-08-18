// components/pages/auth/Auth.tsx
import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Box, VStack, Heading, Text,
    Input, InputField, Button, ButtonText,
    FormControl, FormControlLabel, FormControlLabelText,
    FormControlError, FormControlErrorText,
    HStack, Badge, BadgeText
} from '@gluestack-ui/themed';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type Profile = {
    name: string;
    email: string;
    createdAt: string;
};

export const STORAGE_KEYS = {
    PROFILE: 'app.profile',
};

type Props = {
    onDone?: () => void; // вызываем после успешной авторизации
};

const Auth: React.FC<Props> = ({ onDone }) => {
    const [name, setName]   = useState('');
    const [email, setEmail] = useState('');
    const [busy, setBusy]   = useState(false);

    const nameErr  = useMemo(() => (name.trim().length < 2 ? 'Минимум 2 символа' : ''), [name]);
    const emailErr = useMemo(() => (!EMAIL_RE.test(email.trim()) ? 'Некорректный email' : ''), [email]);
    const valid    = !nameErr && !emailErr && !!name && !!email;

    const handleSubmit = async () => {
        if (!valid || busy) return;
        try {
            setBusy(true);
            const profile: Profile = {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                createdAt: new Date().toISOString(),
            };
            await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
            onDone?.();
        } finally {
            setBusy(false);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <Box flex={1} p="$4" justifyContent="center">
                <VStack space="xl">
                    <VStack space="xs">
                        <Heading size="xl">Добро пожаловать 👋</Heading>
                        <Text size="sm" color="$textLight600">
                            Введи имя и email — и можно пользоваться приложением.
                        </Text>
                        <HStack space="sm" mt="$2">
                            <Badge variant="outline" rounded="$full"><BadgeText size="2xs">Оффлайн</BadgeText></Badge>
                            <Badge variant="outline" rounded="$full"><BadgeText size="2xs">Без сервера</BadgeText></Badge>
                            <Badge variant="outline" rounded="$full"><BadgeText size="2xs">Локально</BadgeText></Badge>
                        </HStack>
                    </VStack>

                    <VStack space="md">
                        <FormControl isInvalid={!!nameErr}>
                            <FormControlLabel><FormControlLabelText>Имя</FormControlLabelText></FormControlLabel>
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
                                <FormControlError><FormControlErrorText>{nameErr}</FormControlErrorText></FormControlError>
                            ) : null}
                        </FormControl>

                        <FormControl isInvalid={!!emailErr}>
                            <FormControlLabel><FormControlLabelText>Email</FormControlLabelText></FormControlLabel>
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
                                <FormControlError><FormControlErrorText>{emailErr}</FormControlErrorText></FormControlError>
                            ) : null}
                        </FormControl>
                    </VStack>

                    <Button
                        size="md"
                        rounded="$2xl"
                        isDisabled={!valid || busy}
                        onPress={handleSubmit}
                    >
                        <ButtonText>{busy ? 'Сохраняю…' : 'Продолжить'}</ButtonText>
                    </Button>

                    <Text size="xs" color="$textLight500">
                        Данные сохраняются только на устройстве.
                        Изменить их можно в «Настройках».
                    </Text>
                </VStack>
            </Box>
        </KeyboardAvoidingView>
    );
};

export default Auth;
