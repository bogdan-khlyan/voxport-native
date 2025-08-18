// components/pages/chats/Chats.tsx
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { VStack, Heading, Text, Icon, HStack } from '@gluestack-ui/themed';
import { MessageCircle, Phone, Save, Search, Loader2, User } from 'lucide-react-native';
import BaseButton from '../../common/BaseButton';
import BaseInput from '../../common/BaseInput';
import BaseAvatar from '../../common/BaseAvatar';
import BaseTypography from '../../common/BaseTypography';
import BaseCallButton from '../../common/BaseCallButton';
import BaseContactCard from '../../common/BaseContactCard';

export default function Chats() {
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [query, setQuery] = useState('');
    const [muted, setMuted] = useState(false);
    const [videoOff, setVideoOff] = useState(false);
    const [speakerOn, setSpeakerOn] = useState(false);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.select({ ios: 'padding', android: undefined })}
            keyboardVerticalOffset={Platform.select({ ios: 64, android: 0 })}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, padding: 24 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator
            >
                <VStack space="2xl" alignItems="center" width="100%">
                    <Icon as={MessageCircle} size="xl" color="$textLight500" />
                    <Heading size="md">Чаты в разработке</Heading>
                    <Text size="sm" color="$textLight500" textAlign="center">
                        Функционал чатов будет добавлен в будущем.
                        Сейчас вы можете пользоваться звонками и контактами.
                    </Text>

                    {/* 🔹 Примеры BaseTypography */}
                    <VStack space="lg" width="100%" mt="$8">
                        <Heading size="sm">Typography</Heading>
                        <BaseTypography variant="h1">Заголовок H1</BaseTypography>
                        <BaseTypography variant="h2">Заголовок H2</BaseTypography>
                        <BaseTypography variant="h3">Заголовок H3</BaseTypography>
                        <BaseTypography variant="h4">Заголовок H4</BaseTypography>
                        <BaseTypography variant="h5">Заголовок H5</BaseTypography>
                        <BaseTypography variant="h6">Заголовок H6</BaseTypography>
                        <BaseTypography>
                            Это пример обычного текста (body). Тут может быть описание, инструкция или абзац.
                        </BaseTypography>
                        <BaseTypography variant="link" href="https://voxport.app">
                            Ссылка на сайт Voxport
                        </BaseTypography>
                    </VStack>

                    {/* 🔹 Примеры Avatar */}
                    <VStack space="lg" width="100%" mt="$8">
                        <Heading size="sm">Avatar</Heading>
                        <HStack space="md" alignItems="center">
                            <BaseAvatar src="https://i.pravatar.cc/100?img=15" size="md" />
                            <BaseAvatar fallback="BH" size="md" />
                            <BaseAvatar size="md" iconFallback={<Icon as={User} size="sm" />} />
                        </HStack>
                        <HStack space="md" alignItems="center">
                            <BaseAvatar fallback="XS" size="xs" />
                            <BaseAvatar fallback="SM" size="sm" />
                            <BaseAvatar fallback="MD" size="md" />
                            <BaseAvatar fallback="LG" size="lg" />
                            <BaseAvatar fallback="XL" size="xl" />
                        </HStack>
                        <HStack space="md" alignItems="center">
                            <BaseAvatar
                                src="https://i.pravatar.cc/100?img=32"
                                size="lg"
                                onPress={() => console.log('Open profile')}
                            />
                            <Text size="xs" color="$textLight500">
                                Нажми на аватар — откроется профиль (лог в консоль)
                            </Text>
                        </HStack>
                    </VStack>

                    {/* 🔹 Примеры BaseInput */}
                    <VStack space="lg" width="100%" mt="$8">
                        <BaseInput
                            label="Email"
                            placeholder="you@voxport.app"
                            value={email}
                            onChangeText={setEmail}
                            leftIcon={<Icon as={Search} size="sm" />}
                            helperText="Мы никогда не делимся вашей почтой."
                            autoCapitalize="none"
                            keyboardType="email-address"
                            clearable
                        />
                        <BaseInput
                            label="Пароль"
                            placeholder="Введите пароль"
                            value={pwd}
                            onChangeText={setPwd}
                            secureTextEntry
                            passwordToggle
                            helperText="Минимум 8 символов."
                        />
                        <BaseInput
                            label="Поиск по чатам"
                            placeholder="Введите запрос"
                            value={query}
                            onChangeText={setQuery}
                            rightIcon={<Icon as={Search} size="sm" />}
                            clearable
                        />
                        <BaseInput label="Инпут в загрузке" placeholder="Подгружаем варианты..." loading />
                        <BaseInput
                            label="Инпут с ошибкой"
                            placeholder="Тут будет ошибка"
                            isInvalid
                            errorText="Неверный формат данных"
                        />
                    </VStack>

                    {/* 🔹 Примеры BaseButton */}
                    <VStack space="lg" width="100%" mt="$8">
                        <BaseButton label="Простой primary" onPress={() => {}} />
                        <BaseButton
                            label="Outline Success"
                            variant="outline"
                            intent="success"
                            leftIcon={<Icon as={Save} size="sm" />}
                            onPress={() => {}}
                        />
                        <BaseButton
                            label="Full Width Call"
                            intent="primary"
                            fullWidth
                            leftIcon={<Icon as={Phone} size="sm" />}
                            onPress={() => {}}
                        />
                        <BaseButton
                            label="Загрузка..."
                            loading
                            fullWidth
                            onPress={() => {}}
                            rightIcon={<Icon as={Loader2} size="sm" />}
                        />
                        <HStack space="md" width="100%" justifyContent="center">
                            <BaseButton label="XS" size="xs" intent="secondary" onPress={() => {}} />
                            <BaseButton label="SM" size="sm" intent="warning" onPress={() => {}} />
                            <BaseButton label="LG" size="lg" intent="error" onPress={() => {}} />
                        </HStack>
                    </VStack>

                    {/* 🔹 Примеры BaseCallButton */}
                    <VStack space="lg" width="100%" mt="$8">
                        <Heading size="sm">Call Controls</Heading>

                        {/* Answer / End */}
                        <HStack space="2xl" justifyContent="center">
                            <VStack space="xs" alignItems="center">
                                <BaseCallButton type="answer" onPress={() => console.log('Answer call')} />
                                <Text size="xs" color="$textLight500">Answer</Text>
                            </VStack>
                            <VStack space="xs" alignItems="center">
                                <BaseCallButton type="end" onPress={() => console.log('End call')} />
                                <Text size="xs" color="$textLight500">End</Text>
                            </VStack>
                        </HStack>

                        {/* Toggles */}
                        <HStack space="2xl" justifyContent="center">
                            <VStack space="xs" alignItems="center">
                                <BaseCallButton
                                    type="mute"
                                    active={muted}
                                    onPress={() => setMuted((s) => !s)}
                                />
                                <Text size="xs" color="$textLight500">{muted ? 'Unmute' : 'Mute'}</Text>
                            </VStack>
                            <VStack space="xs" alignItems="center">
                                <BaseCallButton
                                    type="video"
                                    active={videoOff}
                                    onPress={() => setVideoOff((s) => !s)}
                                />
                                <Text size="xs" color="$textLight500">{videoOff ? 'Video off' : 'Video on'}</Text>
                            </VStack>
                            <VStack space="xs" alignItems="center">
                                <BaseCallButton
                                    type="speaker"
                                    active={speakerOn}
                                    onPress={() => setSpeakerOn((s) => !s)}
                                />
                                <Text size="xs" color="$textLight500">{speakerOn ? 'Speaker on' : 'Speaker off'}</Text>
                            </VStack>
                        </HStack>
                    </VStack>

                    {/* 🔹 Примеры BaseContactCard */}
                    <VStack space="md" width="100%" mt="$8">
                        <Heading size="sm">Contact Card</Heading>
                        <BaseContactCard
                            name="Alice Johnson"
                            status="online"
                            avatarSrc="https://i.pravatar.cc/100?img=11"
                            onCallPress={() => console.log('Call Alice')}
                        />
                        <BaseContactCard
                            name="Bogdan Hlyan"
                            status="last seen 5m ago"
                            avatarSrc="https://i.pravatar.cc/100?img=3"
                            onCallPress={() => console.log('Call Bogdan')}
                        />
                        <BaseContactCard
                            name="Anton Petrov"
                            status="offline"
                            avatarFallback="AP"
                            onCallPress={() => console.log('Call Anton')}
                        />
                    </VStack>
                </VStack>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
