// components/pages/settings/Settings.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Box,
    VStack,
    HStack,
    Heading,
    Text,
    Divider,
    Switch,
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
} from '@gluestack-ui/themed';
import { STORAGE_KEYS } from '../auth/Auth';

type Props = {
    onLogout?: () => void;
};

type ThemeMode = 'system' | 'light' | 'dark';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <VStack space="md">
        <Heading size="sm">{title}</Heading>
        <Box bg="$background0" borderWidth="$1" borderColor="$borderLight300" rounded="$2xl" p="$4">
            {children}
        </Box>
    </VStack>
);

const Row: React.FC<{ label: string; hint?: string; right?: React.ReactNode }> = ({ label, hint, right }) => (
    <VStack space="xs" mb="$3">
        <HStack alignItems="center" justifyContent="space-between">
            <Text size="md">{label}</Text>
            {right}
        </HStack>
        {hint ? <Text size="xs" color="$textLight500">{hint}</Text> : null}
    </VStack>
);

const initials = (name?: string) =>
    (name || 'User')
        .split(' ')
        .map((p) => p[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();

export default function Settings({ onLogout }: Props) {
    // Профиль (из Auth)
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [savingProfile, setSavingProfile] = useState(false);

    // Аудио/Видео
    const [startMuted, setStartMuted] = useState(false);
    const [startVideoOff, setStartVideoOff] = useState(true);
    const [useSpeaker, setUseSpeaker] = useState(true);
    const [echoCancellation, setEchoCancellation] = useState(true);
    const [camera, setCamera] = useState<'front' | 'back'>('front');

    // Уведомления
    const [pushEnabled, setPushEnabled] = useState(true);
    const [ringtoneEnabled, setRingtoneEnabled] = useState(true);
    const [vibrate, setVibrate] = useState(true);

    // Интерфейс
    const [theme, setTheme] = useState<ThemeMode>('system');
    const themeLabel = useMemo(
        () => ({ system: 'Системная', light: 'Светлая', dark: 'Тёмная' }[theme]),
        [theme]
    );

    // Валидация профиля
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameErr = useMemo(() => (name.trim().length < 2 ? 'Минимум 2 символа' : ''), [name]);
    const emailErr = useMemo(() => (!EMAIL_RE.test(email.trim()) ? 'Некорректный email' : ''), [email]);
    const profileValid = !nameErr && !emailErr && !!name && !!email;

    useEffect(() => {
        (async () => {
            const raw = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
            if (raw) {
                try {
                    const p = JSON.parse(raw) as { name: string; email: string };
                    setName(p?.name ?? '');
                    setEmail(p?.email ?? '');
                } catch {}
            }
        })();
    }, []);

    const saveProfile = async () => {
        if (!profileValid || savingProfile) return;
        try {
            setSavingProfile(true);
            await AsyncStorage.setItem(
                STORAGE_KEYS.PROFILE,
                JSON.stringify({ name: name.trim(), email: email.trim(), createdAt: new Date().toISOString() })
            );
        } finally {
            setSavingProfile(false);
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem(STORAGE_KEYS.PROFILE);
        onLogout?.();
    };

    const appVersion = '1.0.0';
    const sdkVersion = 'Jitsi RN SDK — 11.x';

    return (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
            <VStack space="xl">
                {/* Профиль */}
                <Section title="Профиль">
                    <HStack alignItems="center" space="md" mb="$4">
                        <Avatar size="md" bg="$background200" borderWidth="$1" borderColor="$borderLight300">
                            <AvatarFallbackText>{initials(name)}</AvatarFallbackText>
                        </Avatar>
                        <VStack>
                            <Heading size="sm">{name || 'Без имени'}</Heading>
                            <Text size="xs" color="$textLight500">{email || 'email не указан'}</Text>
                        </VStack>
                    </HStack>

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

                            <Button
                                variant="outline"
                                action="negative"
                                rounded="$2xl"
                                onPress={handleLogout}
                            >
                                <ButtonText>Выйти</ButtonText>
                            </Button>
                        </HStack>
                    </VStack>
                </Section>

                {/* Аудио и видео */}
                <Section title="Аудио и видео">
                    <Row
                        label="Входить с выключенным микрофоном"
                        right={<Switch value={startMuted} onValueChange={setStartMuted} />}
                    />
                    <Row
                        label="Входить с выключенным видео"
                        right={<Switch value={startVideoOff} onValueChange={setStartVideoOff} />}
                    />
                    <Row
                        label="Всегда использовать динамик"
                        hint="Если выключено — при гарнитуре/наушниках звук уйдёт туда"
                        right={<Switch value={useSpeaker} onValueChange={setUseSpeaker} />}
                    />
                    <Row
                        label="Эхоподавление"
                        right={<Switch value={echoCancellation} onValueChange={setEchoCancellation} />}
                    />
                    <Divider my="$2" />
                    <Text size="md" mb="$2">Камера по умолчанию</Text>
                    <HStack space="sm">
                        <Button
                            variant={camera === 'front' ? 'solid' : 'outline'}
                            action={camera === 'front' ? 'primary' : 'secondary'}
                            onPress={() => setCamera('front')}
                            rounded="$2xl"
                        >
                            <ButtonText>Фронтальная</ButtonText>
                        </Button>
                        <Button
                            variant={camera === 'back' ? 'solid' : 'outline'}
                            action={camera === 'back' ? 'primary' : 'secondary'}
                            onPress={() => setCamera('back')}
                            rounded="$2xl"
                        >
                            <ButtonText>Тыловая</ButtonText>
                        </Button>
                    </HStack>
                </Section>

                {/* Уведомления */}
                <Section title="Уведомления">
                    <Row label="Push-уведомления" right={<Switch value={pushEnabled} onValueChange={setPushEnabled} />} />
                    <Row label="Рингтон при входящем" right={<Switch value={ringtoneEnabled} onValueChange={setRingtoneEnabled} />} />
                    <Row label="Вибрация" right={<Switch value={vibrate} onValueChange={setVibrate} />} />
                </Section>

                {/* Интерфейс */}
                <Section title="Интерфейс">
                    <Text size="md" mb="$2">Тема</Text>
                    <HStack space="sm" mb="$1">
                        {(['system', 'light', 'dark'] as ThemeMode[]).map((t) => (
                            <Button
                                key={t}
                                variant={theme === t ? 'solid' : 'outline'}
                                action={theme === t ? 'primary' : 'secondary'}
                                onPress={() => setTheme(t)}
                                rounded="$2xl"
                            >
                                <ButtonText>
                                    {t === 'system' ? 'Системная' : t === 'light' ? 'Светлая' : 'Тёмная'}
                                </ButtonText>
                            </Button>
                        ))}
                    </HStack>
                    <Text size="xs" color="$textLight500">Текущая: {themeLabel}</Text>
                </Section>

                {/* О приложении */}
                <Section title="О приложении">
                    <VStack space="sm">
                        <HStack alignItems="center" justifyContent="space-between">
                            <Text>Версия</Text>
                            <Text color="$textLight500">{appVersion}</Text>
                        </HStack>
                        <HStack alignItems="center" justifyContent="space-between">
                            <Text>Jitsi SDK</Text>
                            <Text color="$textLight500">{sdkVersion}</Text>
                        </HStack>
                    </VStack>
                </Section>
            </VStack>
        </ScrollView>
    );
}
