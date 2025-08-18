import React from 'react';
import {
    Box, VStack, HStack, Heading, Text, Divider,
    Input, InputField, Button, ButtonText, Badge, BadgeText, Switch
} from '@gluestack-ui/themed';

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
        <VStack px="$4" space="md">
            {/* Заголовок + действия */}
            <HStack alignItems="center" justifyContent="space-between">
                <Heading size="xl">{title}</Heading>
                <HStack space="sm" alignItems="center">
                    <Badge action="muted">
                        <BadgeText>{count}</BadgeText>
                    </Badge>
                    {!!onInvite && (
                        <Button size="sm" onPress={onInvite}>
                            <ButtonText>Пригласить</ButtonText>
                        </Button>
                    )}
                </HStack>
            </HStack>

            {/* Поиск + фильтр Online */}
            <VStack space="sm">
                <Input>
                    <InputField
                        placeholder="Поиск по имени или email"
                        value={query}
                        onChangeText={onQueryChange}
                        autoCapitalize="none"
                    />
                </Input>
                <HStack alignItems="center" justifyContent="space-between">
                    <Text color="$textLight700">Показывать только online</Text>
                    <Switch value={onlyOnline} onValueChange={onToggleOnline} />
                </HStack>
            </VStack>

            <Divider />
        </VStack>
    );
};

export default ContactsHeader;
