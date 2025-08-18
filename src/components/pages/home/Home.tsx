// components/Home.tsx
import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {Button, ButtonText, VStack} from '@gluestack-ui/themed';

const Home = () => {
    const navigation = useNavigation<any>();
    const [room, onChangeRoom] = useState('');

    const openContact = () => {
        navigation.navigate('Contact', {
            contact: {
                id: '1',
                name: 'Alice Johnson',
                email: 'alice@example.com',
                phone: '+1234567890',
                online: true,
                tags: ['friend', 'colleague'],
                note: 'Заметка для Алисы',
                lastSeenAt: new Date().toISOString(),
            },
        });
    };

    return (
        <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center', padding: 16 }}>
            <TextInput
                onChangeText={onChangeRoom}
                placeholder="Enter room name here"
                style={{ color: 'black', padding: 12, alignSelf: 'stretch', maxWidth: 420, borderWidth: 1 }}
                value={room}
            />

            <VStack space="md" mt="$4">
                <Button isDisabled={!room} onPress={() => navigation.navigate('Meeting', { room })}>
                    <ButtonText>Join</ButtonText>
                </Button>

                <Button variant="outline" onPress={() => navigation.navigate('Demo')}>
                    <ButtonText>DEMO</ButtonText>
                </Button>

                <Button variant="outline" onPress={() => navigation.navigate('Login')}>
                    <ButtonText>LOGIN</ButtonText>
                </Button>

                <Button variant="outline" onPress={() => navigation.navigate('Contacts')}>
                    <ButtonText>CONTACTS</ButtonText>
                </Button>

                <Button action="primary" onPress={openContact}>
                    <ButtonText>ContactDetails</ButtonText>
                </Button>
            </VStack>
        </View>
    );
};

export default Home;
