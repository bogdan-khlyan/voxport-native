// components/pages/chats/Chats.tsx
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { VStack, Heading, Text, Icon } from '@gluestack-ui/themed';
import { MessageCircle } from 'lucide-react-native';

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
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <VStack
                    space="2xl"
                    alignItems="center"
                    justifyContent="center"   // по центру по вертикали
                    flex={1}                  // растягиваем
                    px={6}                    // вместо padding:24
                >
                    <Icon as={MessageCircle} size="xl" color="$textLight500" />
                    <Heading size="md">Чаты в разработке</Heading>
                    <Text size="sm" color="$textLight500" textAlign="center">
                        Функционал чатов будет добавлен в будущем.{"\n"}
                        Сейчас вы можете пользоваться звонками и контактами.
                    </Text>
                </VStack>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
