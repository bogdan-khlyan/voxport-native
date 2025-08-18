// components/Login.tsx
import React from 'react';
import { Platform, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import {
    Box, VStack, HStack, Center,
    Heading, Text, Divider,
    Input, InputField,
    Button, ButtonText,
    FormControl, FormControlLabel, FormControlLabelText,
    FormControlError, FormControlErrorText,
    Checkbox, CheckboxIndicator, CheckboxIcon, CheckboxLabel,
    Badge, BadgeText,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';


type Props = {
    onSubmit?: (email: string, password: string, remember: boolean) => Promise<void> | void;
    loading?: boolean;
};

const Login: React.FC<Props> = ({ onSubmit, loading }) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPass, setShowPass] = React.useState(false);
    const [remember, setRemember] = React.useState(true);

    const [errors, setErrors] = React.useState<{ email?: string; password?: string; common?: string }>({});

    const navigation = useNavigation();

    const validate = () => {
        const next: typeof errors = {};
        if (!email.trim()) next.email = 'Введите e-mail';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Некорректный e-mail';
        if (!password) next.password = 'Введите пароль';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleLogin = async () => {
        if (!validate()) return;
        try {
            setErrors({});
            await onSubmit?.(email.trim(), password, remember);
            // сюда можно добавить навигацию при успехе
        } catch (e: any) {
            setErrors({ common: e?.message || 'Не удалось войти. Попробуйте ещё раз.' });
        }
    };

    return (
        <Box flex={1} bg="$backgroundDark950">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <Center flex={1} px="$5">
                    <VStack w="100%" maxWidth={420} space="xl">
                        {/* Лого / бренд */}
                        <VStack space="xs" alignItems="center">
                            <Badge bg="$primary600" px="$3" py="$1.5" borderRadius="$full">
                                <BadgeText color="white" bold>VOXPORT</BadgeText>
                            </Badge>
                            <Heading size="2xl" color="$textDark50" mt="$2">Вход</Heading>
                            <Text color="$textDark400" textAlign="center">
                                Добро пожаловать! Войдите в аккаунт, чтобы продолжить.
                            </Text>
                        </VStack>

                        {/* Ошибка общего уровня */}
                        {errors.common ? (
                            <Box bg="$red800" borderColor="$red700" borderWidth={1} p="$3" borderRadius="$lg">
                                <Text color="$textDark50">{errors.common}</Text>
                            </Box>
                        ) : null}

                        {/* Email */}
                        <FormControl isInvalid={!!errors.email}>
                            <FormControlLabel>
                                <FormControlLabelText color="$textDark300">E-mail</FormControlLabelText>
                            </FormControlLabel>
                            <Input bg="$backgroundDark900" borderColor="$borderDark700" size="lg">
                                <InputField
                                    placeholder="you@company.com"
                                    placeholderTextColor="#8b8b8b"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    value={email}
                                    onChangeText={setEmail}
                                    style={{ color: 'white' }}
                                />
                            </Input>
                            {errors.email ? (
                                <FormControlError>
                                    <FormControlErrorText>{errors.email}</FormControlErrorText>
                                </FormControlError>
                            ) : null}
                        </FormControl>

                        {/* Password */}
                        <FormControl isInvalid={!!errors.password}>
                            <FormControlLabel>
                                <FormControlLabelText color="$textDark300">Пароль</FormControlLabelText>
                            </FormControlLabel>
                            <HStack space="sm" alignItems="center">
                                <Input flex={1} bg="$backgroundDark900" borderColor="$borderDark700" size="lg">
                                    <InputField
                                        placeholder="••••••••"
                                        placeholderTextColor="#8b8b8b"
                                        secureTextEntry={!showPass}
                                        value={password}
                                        onChangeText={setPassword}
                                        style={{ color: 'white' }}
                                    />
                                </Input>
                                <TouchableOpacity onPress={() => setShowPass(v => !v)}>
                                    <Text color="$textDark300">{showPass ? 'Скрыть' : 'Показать'}</Text>
                                </TouchableOpacity>
                            </HStack>
                            {errors.password ? (
                                <FormControlError>
                                    <FormControlErrorText>{errors.password}</FormControlErrorText>
                                </FormControlError>
                            ) : null}
                        </FormControl>

                        {/* Remember + Forgot */}
                        <HStack alignItems="center" justifyContent="space-between">
                            <Checkbox value={remember ? '1' : ''} isChecked={remember} onChange={setRemember}>
                                <CheckboxIndicator mr="$2">
                                    <CheckboxIcon />
                                </CheckboxIndicator>
                                <CheckboxLabel color="$textDark300">Запомнить меня</CheckboxLabel>
                            </Checkbox>
                            <TouchableOpacity onPress={() => { /* навигировать на восстановление */ }}>
                                <Text color="$primary400">Забыли пароль?</Text>
                            </TouchableOpacity>
                        </HStack>

                        {/* Login button */}
                        <Button
                            size="lg"
                            action="primary"
                            isDisabled={loading}
                            // @ts-ignore
                            onPress={() => navigation.navigate('Contacts')}
                        >
                            <ButtonText>{loading ? 'Входим…' : 'Войти'}</ButtonText>
                        </Button>

                        {/* Divider */}
                        <HStack alignItems="center" space="sm">
                            <Divider flex={1} bg="$borderDark700" />
                            <Text color="$textDark500">или</Text>
                            <Divider flex={1} bg="$borderDark700" />
                        </HStack>

                        {/* Secondary actions */}
                        <HStack justifyContent="center">
                            <Text color="$textDark400">Нет аккаунта? </Text>
                            <TouchableOpacity onPress={() => { /* навигировать на регистрацию */ }}>
                                <Text color="$primary400">Создать</Text>
                            </TouchableOpacity>
                        </HStack>

                        {/* Подпись / версия */}
                        <Center mt="$2">
                            <Text size="xs" color="$textDark600">Voxport • v1.0.0</Text>
                        </Center>
                    </VStack>
                </Center>
            </KeyboardAvoidingView>
        </Box>
    );
};

export default Login;
