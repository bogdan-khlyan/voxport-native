// components/pages/calls/Calls.tsx
import React from 'react';
import { FlatList } from 'react-native';
import { Box, VStack, Heading } from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import CallItem, { CallItemData } from './components/CallItem';

const MOCK_CALLS: CallItemData[] = [
    {
        id: '1',
        name: 'Alice Johnson',
        username: 'alice',
        type: 'video',
        status: 'incoming',
        date: '2025-08-18 12:45',
    },
    {
        id: '2',
        name: 'Anton Petrov',
        username: 'anton',
        type: 'audio',
        status: 'missed',
        date: '2025-08-17 20:10',
    },
    {
        id: '3',
        name: 'Charles Lee',
        username: 'charles',
        type: 'video',
        status: 'outgoing',
        date: '2025-08-17 09:30',
    },
];

export default function Calls() {
    const navigation = useNavigation<any>();

    return (
        <Box flex={1} p="$4" pt="$16">
            <VStack space="md" flex={1}>
                <Heading>Звонки</Heading>

                <FlatList
                    data={MOCK_CALLS}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <CallItem
                            item={item}
                            showDivider={index < MOCK_CALLS.length - 1}
                            onCallPress={(call) => {
                                navigation.navigate('Meeting', {
                                    room: call.username,
                                    audioOnly: call.type === 'audio',
                                });
                            }}
                            onPressRow={(call) => {
                                // пример: открыть детали контакта
                                // navigation.navigate('Contact', { id: call.username });
                            }}
                        />
                    )}
                />
            </VStack>
        </Box>
    );
}
