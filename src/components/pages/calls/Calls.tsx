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
        date: '12:45',
    },
    {
        id: '2',
        name: 'Anton Petrov',
        username: 'anton',
        type: 'audio',
        status: 'missed',
        date: 'Вчера',
    },
    {
        id: '3',
        name: 'Charles Lee',
        username: 'charles',
        type: 'video',
        status: 'outgoing',
        date: '17.08',
    },
];

export default function Calls() {
    const navigation = useNavigation<any>();

    return (
        <Box flex={1} bg="$backgroundLight0" pt="60">
            <VStack flex={1}>
                <Heading px="$4" py="$3" size="md">
                    Звонки
                </Heading>

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
                                // navigation.navigate('Contact', { id: call.username });
                            }}
                        />
                    )}
                />
            </VStack>
        </Box>
    );
}
