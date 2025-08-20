import React, { useMemo, useState, useCallback } from 'react';
import { SectionList, RefreshControl } from 'react-native';
import {
    Box,
    VStack,
    HStack,
    Heading,
    Text,
    Pressable,
    Spinner,
} from '@gluestack-ui/themed';
import Person from './components/Person';
import { useNavigation } from '@react-navigation/native';
import ContactsHeader from './components/ContactsHeader';

type Contact = {
    id: string;
    name: string;
    email: string;
    online?: boolean;
};

const MOCK: Contact[] = [
    { id: '1', name: 'Alice Johnson', email: 'alice@voxport.app', online: true },
    { id: '2', name: 'Anton Petrov',  email: 'anton@voxport.app' },
    { id: '3', name: 'Bogdan Hlyan',  email: 'bogdan@voxport.app', online: true },
    { id: '4', name: 'Charles Lee',   email: 'charles@voxport.app' },
    { id: '5', name: 'Diana Kravets', email: 'diana@voxport.app' },
    { id: '6', name: 'Егор Савченко', email: 'egor@voxport.app', online: true },
];

function groupByInitial(items: Contact[]) {
    const map = new Map<string, Contact[]>();
    for (const c of items) {
        const ch = (c.name[0] || '#').toUpperCase();
        const key = /[A-ZА-ЯЁ]/i.test(ch) ? ch : '#';
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(c);
    }
    return Array.from(map.entries())
        .sort(([a], [b]) => a.localeCompare(b, 'ru'))
        .map(([title, data]) => ({
            title,
            data: data.sort((a, b) => a.name.localeCompare(b.name, 'ru')),
        }));
}

const AVATAR_INSET = 72; // чтобы линия-разделитель начиналась под текстом (как в Telegram)

const Contacts: React.FC = () => {
    const [query, setQuery] = useState('');
    const [onlyOnline, setOnlyOnline] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation<any>();

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const base = onlyOnline ? MOCK.filter(c => c.online) : MOCK;
        return q
            ? base.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
            : base;
    }, [query, onlyOnline]);

    const sections = useMemo(() => groupByInitial(filtered), [filtered]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await new Promise(r => setTimeout(r, 600));
        setRefreshing(false);
    }, []);

    const onInvite = () => navigation.navigate('Invite');
    const onOpenProfile = (c: Contact) => navigation.navigate('Contact', { contact: c });

    return (
        <Box flex={1} bg="$backgroundLight" pt="$16">
            <ContactsHeader
                title="Контакты"
                count={filtered.length}
                query={query}
                onQueryChange={setQuery}
                onlyOnline={onlyOnline}
                onToggleOnline={setOnlyOnline}
                onInvite={onInvite}
            />

            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                stickySectionHeadersEnabled
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                contentContainerStyle={{
                    paddingBottom: 24,
                    paddingLeft: 16,
                    paddingRight: 16,
                }}

                // Хедер как и был — ТОЛЬКО буква, без фона блока
                renderSectionHeader={({ section }) => (
                    <Box bg="$backgroundLight" py="$2">
                        <Text
                            sx={{
                                color: '#000',
                                fontSize: 17,
                                fontStyle: 'normal',
                                fontWeight: '600',
                                lineHeight: 22,
                            }}
                        >
                            {section.title}
                        </Text>
                    </Box>
                )}

                // «Блок» начинается с первого элемента и заканчивается последним
                renderItem={({ item, index, section }) => {
                    const isFirst = index === 0;
                    const isLast  = index === section.data.length - 1;
                    return (
                        <Box
                            bg={'#F5F5F5'}
                            borderTopLeftRadius={isFirst ? 16 : undefined}
                            borderTopRightRadius={isFirst ? 16 : undefined}
                            borderBottomLeftRadius={isLast ? 16 : undefined}
                            borderBottomRightRadius={isLast ? 16 : undefined}
                        >
                            <Pressable
                                onPress={() => onOpenProfile(item)}
                                android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
                            >
                                <Person name={item.name} email={item.email} />
                            </Pressable>
                        </Box>
                    );
                }}

                // Разделитель остаётся как был — рисуется между айтемами внутри «блока»
                ItemSeparatorComponent={() => (
                    <HStack height={1} w="100%">
                        <Box w={AVATAR_INSET} h="100%" bg="#F5F5F5" />
                        <Box flex={1} h="100%" bg="#DBDBDC" />
                    </HStack>
                )}

                ListEmptyComponent={
                    loading ? (
                        <HStack mt="$10" justifyContent="center">
                            <Spinner accessibilityLabel="Загрузка" />
                        </HStack>
                    ) : (
                        <VStack mt="$10" space="sm" alignItems="center">
                            <Heading size="md" color="$textLight600">Контактов нет</Heading>
                            <Text color="$textLight500" textAlign="center">
                                Создайте контакт или используйте поиск.
                            </Text>
                        </VStack>
                    )
                }
                ListFooterComponent={<Box h="$6" />}
            />
        </Box>
    );
};

export default Contacts;
