// components/pages/auth/Auth.tsx
import React, { useState, useMemo } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import {
    Box, VStack, Heading, Text,
    Input, InputField, Button, ButtonText,
    FormControl, FormControlLabel, FormControlLabelText,
    HStack, Badge, BadgeText, FormControlError, FormControlErrorText
} from '@gluestack-ui/themed';
import { useUserStore } from '@/api/user/user.store';

type Props = { onDone?: () => void };

const Auth: React.FC<Props> = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const { login, loading, error } = useUserStore();

    // унифицированный текст ошибки (string | { error: { message } } | HttpError.data)
    const errorText = useMemo(() => {
        if (!error) return '';
        // строка
        if (typeof error === 'string') return error;
        // HttpError с .data?.error?.message
        // или просто объект формата { error: { message } }
        // @ts-ignore — защищаемся от произвольных структур
        return error?.error?.message || error?.message || 'Ошибка';
    }, [error]);

    const handleSubmit = () => {
        console.log('!@E#!@$#@!$')
        login({ email: email || 'any@any', password: name || 'any' });
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
                        <FormControl>
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
                        </FormControl>

                        <FormControl>
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
                        </FormControl>

                        {errorText ? (
                            <FormControl isInvalid>
                                <FormControlError>
                                    <FormControlErrorText>{errorText}</FormControlErrorText>
                                </FormControlError>
                            </FormControl>
                        ) : null}
                    </VStack>

                    <Button
                        size="md"
                        rounded="$2xl"
                        isDisabled={loading}
                        onPress={handleSubmit}
                    >
                        <ButtonText>{loading ? 'Входим…' : 'Продолжить'}</ButtonText>
                    </Button>

                    <Text size="xs" color="$textLight500">
                        Данные сохраняются только на устройстве. Изменить их можно в «Настройках».
                    </Text>
                </VStack>
            </Box>
        </KeyboardAvoidingView>
    );
};

export default Auth;
