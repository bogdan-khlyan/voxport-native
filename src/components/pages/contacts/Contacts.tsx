import React, { useMemo, useState, useCallback } from 'react';
import { Box, VStack, HStack, Heading, Text, Divider, Switch, Pressable, Spinner } from '@gluestack-ui/themed';
import { SectionList, RefreshControl } from 'react-native';
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
    const sections = Array.from(map.entries())
        .sort(([a], [b]) => a.localeCompare(b, 'ru'))
        .map(([title, data]) => ({
            title,
            data: data.sort((a, b) => a.name.localeCompare(b.name, 'ru')),
        }));
    return sections;
}

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

    const onInvite = () => {
        // навигация/экшен «Пригласить»
        navigation.navigate('Contacts'); // при необходимости поменяйте
    };

    const onOpenProfile = (c: Contact) => {
        navigation.navigate('Contact', { contact: c });
    };

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
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
                renderSectionHeader={({ section }) => (
                    <Box bg="$backgroundLight0" py="$1" px="$2" mt="$3" borderRadius="$md">
                        <Text bold>{section.title}</Text>
                    </Box>
                )}
                renderItem={({ item }) => (
                    <Pressable onPress={() => onOpenProfile(item)}>
                        <Person name={item.name} email={item.email} />
                    </Pressable>
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
            />
        </Box>
    );
};

export default Contacts;
