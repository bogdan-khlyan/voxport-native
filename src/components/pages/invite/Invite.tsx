// components/pages/invite/Invite.tsx
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import {
    Box,
    VStack,
    Heading,
    Input,
    InputField,
    Button,
    ButtonText,
    Text,
    Center,
} from "@gluestack-ui/themed";

const Invite: React.FC = () => {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);

    const handleInvite = () => {
        if (!email.trim()) return;
        // TODO: API вызов на отправку приглашения
        console.log("Приглашение отправлено:", email);
        setSent(true);
    };

    return (
        <Box flex={1} bg="$backgroundLight">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
            >
                <Center flex={1} px="$5">
                    <VStack space="lg" w="100%" maxWidth={400} alignItems="center">
                        <Heading size="lg">Пригласить пользователя</Heading>

                        <Input size="lg" w="100%">
                            <InputField
                                placeholder="Введите email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </Input>

                        <Button
                            size="lg"
                            w="100%"
                            onPress={handleInvite}
                            isDisabled={!email.trim()}
                        >
                            <ButtonText>Отправить приглашение</ButtonText>
                        </Button>

                        {sent && (
                            <Text color="$success600">
                                Приглашение отправлено на {email}
                            </Text>
                        )}
                    </VStack>
                </Center>
            </KeyboardAvoidingView>
        </Box>
    );
};

export default Invite;
