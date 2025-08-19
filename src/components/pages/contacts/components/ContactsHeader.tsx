import React from 'react';
import {
    Box, VStack, HStack, Heading, Text, Divider,
    Input, InputField, Button, ButtonText, Badge, BadgeText, Switch, Icon
} from '@gluestack-ui/themed';
import BaseInput from "@/components/common/BaseInput";
import {Search} from "lucide-react-native";

type Props = {
    title?: string;
    count: number;
    query: string;
    onQueryChange: (val: string) => void;
    onlyOnline: boolean;
    onToggleOnline: (val: boolean) => void;
    onInvite?: () => void;
};

const ContactsHeader: React.FC<Props> = ({
                                             title = 'Контакты',
                                             count,
                                             query,
                                             onQueryChange,
                                             onlyOnline,
                                             onToggleOnline,
                                             onInvite,
                                         }) => {
    return (
        <VStack
            px="$4"
            space="md"
            pt={10}
            backgroundColor="rgba(255, 255, 255, 0.10)"
        >
            {/* Заголовок + действия */}
            <HStack alignItems="center" justifyContent="space-between">
                <HStack space="sm" alignItems="center">
                    <Heading size="xl">
                        {title}
                    </Heading>
                    <Badge action="muted">
                        <BadgeText>{count}</BadgeText>
                    </Badge>
                </HStack>
                <HStack space="sm" alignItems="center">
                    {!!onInvite && (
                        <Button
                            size="sm"
                            onPress={onInvite}
                            style={{
                                borderRadius: 50
                            }}
                        >
                            <ButtonText>Пригласить</ButtonText>
                        </Button>
                    )}
                </HStack>
            </HStack>

            {/* Поиск + фильтр Online */}
            <VStack space="sm">
                <BaseInput
                    placeholder="Поиск по имени или email"
                    value={query}
                    onChangeText={onQueryChange}
                    leftIcon={<Icon as={Search} size="sm" />}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    clearable
                />
            </VStack>

            <Divider />
        </VStack>
    );
};

export default ContactsHeader;
