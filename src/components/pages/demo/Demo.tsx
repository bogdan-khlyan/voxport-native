// components/Demo.tsx
import React from 'react';
import { ScrollView } from 'react-native';
import {
    Box,
    VStack,
    HStack,
    Heading,
    Text,
    Divider,
    Input,
    InputField,
    Button,
    ButtonText,
    Badge,
    BadgeText,
    Avatar,
    AvatarFallbackText,
    Switch,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Actionsheet,
    ActionsheetBackdrop,
    ActionsheetDragIndicatorWrapper,
    ActionsheetDragIndicator,
    ActionsheetContent,
    ActionsheetHeader,
    ActionsheetBody,
    ActionsheetItem,
    ActionsheetItemText,
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';

import Person from '../contacts/components/Person';   // 👈 импортируем новый компонент

const Demo: React.FC = () => {
    const navigation = useNavigation<any>();

    const [room, setRoom] = React.useState<string>('');
    const [online, setOnline] = React.useState<boolean>(true);
    const [volume, setVolume] = React.useState<number>(30);

    const [isSheetOpen, setSheetOpen] = React.useState(false);
    const [isDialogOpen, setDialogOpen] = React.useState(false);

    const onJoin = () => {
        if (!room) return;
        navigation.navigate('Meeting', { room });
    };

    return (
        <Box flex={1} bg="$backgroundLight">
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <VStack space="lg">
                    {/* Заголовок */}
                    <VStack space="xs">
                        <Heading size="2xl">Gluestack Demo</Heading>
                        <Text color="$textLight700">
                            Быстрый обзор базовых компонентов: поля ввода, кнопки, бейджи, переключатели, слайдеры и модалки.
                        </Text>
                    </VStack>

                    <Divider />

                    {/* Блок "Подключиться к комнате" */}
                    <VStack space="md">
                        <Heading size="lg">Подключение к комнате</Heading>
                        <Input>
                            <InputField
                                placeholder="Введите имя комнаты"
                                value={room}
                                onChangeText={setRoom}
                                autoCapitalize="none"
                            />
                        </Input>
                        <HStack space="md" alignItems="center">
                            <Button onPress={onJoin} isDisabled={!room}>
                                <ButtonText>Join</ButtonText>
                            </Button>
                            <Badge action={online ? 'success' : 'muted'}>
                                <BadgeText>{online ? 'online' : 'offline'}</BadgeText>
                            </Badge>
                            <Avatar size="md">
                                <AvatarFallbackText>BG</AvatarFallbackText>
                            </Avatar>
                        </HStack>
                    </VStack>

                    <Divider />

                    {/* Переключатель и слайдер */}
                    <VStack space="md">
                        <Heading size="lg">Настройки</Heading>
                        <HStack alignItems="center" justifyContent="space-between">
                            <Text>Статус</Text>
                            <HStack space="sm" alignItems="center">
                                <Text color="$textLight700">{online ? 'Online' : 'Offline'}</Text>
                                <Switch value={online} onValueChange={setOnline} />
                            </HStack>
                        </HStack>

                        <VStack space="xs">
                            <HStack justifyContent="space-between" alignItems="center">
                                <Text>Громкость</Text>
                                <Text color="$textLight700">{volume}%</Text>
                            </HStack>
                            <Slider
                                value={volume}
                                onChange={(v: number) => setVolume(v)}
                                minValue={0}
                                maxValue={100}
                                step={1}
                            >
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                        </VStack>
                    </VStack>

                    <Divider />

                    {/* 👇 Новый блок со списком Person */}
                    <VStack space="md">
                        <Heading size="lg">Список людей</Heading>
                        <Person name="Bogdan Hlyan" email="bogdan@example.com" />
                        <Person name="Alice Johnson" email="alice@example.com" />
                        <Person name="Anton Petrov" email="anton@example.com" />
                    </VStack>

                    <Divider />

                    <Button
                        action="negative"
                        onPress={() => navigation.navigate('Contacts')}
                    >
                        <ButtonText>НАЗАД</ButtonText>
                    </Button>

                    {/* Actionsheet */}
                    <VStack space="md">
                        <Heading size="lg">Actionsheet</Heading>
                        <Text color="$textLight700">
                            Нижнее меню действий. Требует пакеты @react-native-aria/overlays и @react-native-aria/dialog.
                        </Text>
                        <Button onPress={() => setSheetOpen(true)}>
                            <ButtonText>Показать Actionsheet</ButtonText>
                        </Button>

                        <Actionsheet isOpen={isSheetOpen} onClose={() => setSheetOpen(false)}>
                            <ActionsheetBackdrop />
                            <ActionsheetContent>
                                <ActionsheetDragIndicatorWrapper>
                                    <ActionsheetDragIndicator />
                                </ActionsheetDragIndicatorWrapper>
                                <ActionsheetHeader>
                                    <Heading size="md">Действия</Heading>
                                </ActionsheetHeader>
                                <ActionsheetBody>
                                    <ActionsheetItem onPress={() => { setOnline(!online); setSheetOpen(false); }}>
                                        <ActionsheetItemText>{online ? 'Сделать offline' : 'Сделать online'}</ActionsheetItemText>
                                    </ActionsheetItem>
                                    <ActionsheetItem onPress={() => { setDialogOpen(true); setSheetOpen(false); }}>
                                        <ActionsheetItemText>Показать AlertDialog</ActionsheetItemText>
                                    </ActionsheetItem>
                                    <ActionsheetItem onPress={() => setSheetOpen(false)}>
                                        <ActionsheetItemText>Отмена</ActionsheetItemText>
                                    </ActionsheetItem>
                                </ActionsheetBody>
                            </ActionsheetContent>
                        </Actionsheet>
                    </VStack>

                    {/* AlertDialog */}
                    <AlertDialog isOpen={isDialogOpen} onClose={() => setDialogOpen(false)}>
                        <AlertDialogBackdrop />
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <Heading size="lg">Подтверждение</Heading>
                            </AlertDialogHeader>
                            <AlertDialogBody>
                                <Text>Сбросить громкость к значению по умолчанию (30%)?</Text>
                            </AlertDialogBody>
                            <AlertDialogFooter>
                                <HStack space="sm" justifyContent="flex-end">
                                    <Button variant="outline" onPress={() => setDialogOpen(false)}>
                                        <ButtonText>Отмена</ButtonText>
                                    </Button>
                                    <Button
                                        action="negative"
                                        onPress={() => {
                                            setVolume(30);
                                            setDialogOpen(false);
                                        }}
                                    >
                                        <ButtonText>Сбросить</ButtonText>
                                    </Button>
                                </HStack>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </VStack>
            </ScrollView>
        </Box>
    );
};

export default Demo;
