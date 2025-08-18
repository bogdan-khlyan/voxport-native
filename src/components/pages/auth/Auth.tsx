// components/pages/auth/Auth.tsx
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import {
    Box, VStack, Heading, Text,
    Input, InputField, Button, ButtonText,
    FormControl, FormControlLabel, FormControlLabelText,
    HStack, Badge, BadgeText, FormControlError, FormControlErrorText
} from '@gluestack-ui/themed';

// Хук стора
import { useUserStore } from '@/api/user/user.store'; // скорректируй путь, если нужно

type Props = { onDone?: () => void };

const Auth: React.FC<Props> = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // берём методы/состояние из стора
    const { login, loading, error } = useUserStore();

    const handleSubmit = () => {
        // Принимаем любые креды — просто инициируем login(thunk).
        // Сервис вернёт тестового пользователя voxport/test@voxport.net.
        login({ email: email || 'any@any', password: name || 'any' });
        // onDone не нужен: редирект произойдёт через RootGate по isAuthed из стора
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

                        {error ? (
                            <FormControlError>
                                <FormControlErrorText>{String(error)}</FormControlErrorText>
                            </FormControlError>
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
