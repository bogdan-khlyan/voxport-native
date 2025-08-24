// src/screens/Calls/Calls.tsx
import React, { useMemo, useEffect } from 'react';
import { FlatList } from 'react-native';
import { Box, VStack, Heading, Center, Text } from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import CallItem, { CallItemData } from './components/CallItem';
import { hydrateCalls, selectCalls, selectHydrating, CallItem as StoreCallItem } from '@/api/calls/calls.store';

export default function Calls() {
    const navigation = useNavigation<any>();
    const dispatch = useDispatch();

    const calls = useSelector(selectCalls as any);
    const hydrating = useSelector(selectHydrating as any);

    useEffect(() => {
        dispatch(hydrateCalls() as any);
    }, [dispatch]);

    const data: CallItemData[] = useMemo(() => calls.map(mapStoreCallToUi), [calls]);

    return (
        <Box flex={1} bg="$backgroundLight0" pt={60}>
            <VStack flex={1}>
                <Heading
                    px="$4"
                    py="$3"
                    style={{
                        color: '#000',
                        fontSize: 34,
                        fontWeight: '700',
                        lineHeight: 41,
                        letterSpacing: 0.374,
                        borderBottomWidth: 1,
                        borderBottomColor: '#DBDBDC',
                    }}
                >
                    Звонки
                </Heading>

                {hydrating ? (
                    <Center flex={1} px="$4">
                        <Text size="md" color="$textLight500">Загружаем историю…</Text>
                    </Center>
                ) : data.length === 0 ? (
                    <Center flex={1} px="$4">
                        <Text size="md" color="$textLight500">История звонков пуста</Text>
                    </Center>
                ) : (
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item, index }) => (
                            <CallItem
                                item={item}
                                showDivider={index < data.length - 1}
                                onCallPress={(call) => {
                                    navigation.navigate('Meeting', {
                                        room: call.username,
                                        audioOnly: call.type === 'audio',
                                    });
                                }}
                                onPressRow={() => {}}
                            />
                        )}
                    />
                )}
            </VStack>
        </Box>
    );
}

/** ------- helpers ------- */
function mapStoreCallToUi(c: StoreCallItem): CallItemData {
    return {
        id: c.id,
        name: c.peerName,
        username: c.peerId,
        type: c.isVideo ? 'video' : 'audio',
        status: c.status === 'missed' ? 'missed' : (c.direction === 'in' ? 'incoming' : 'outgoing'),
        date: new Date(c.startedAt).toISOString(),
    };
}
