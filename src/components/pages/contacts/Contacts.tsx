// Contacts.tsx
import React, { useMemo, useState, useCallback } from 'react';
import { SectionList, RefreshControl } from 'react-native';
import { Box, VStack, HStack, Heading, Text, Pressable, Spinner } from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import ContactsHeader from './components/ContactsHeader';
import Person from './components/Person';
import { useUserStore } from '@/api/user/user.store';
import type { User } from '@/api/user/user.service';

function groupByInitial(items: User[]) {
    const map = new Map<string, User[]>();
    for (const u of items) {
        const base = u.username || u.link || '';
        const ch = (base[0] || '#').toUpperCase();
        const key = /[A-ZА-ЯЁ]/i.test(ch) ? ch : '#';
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(u);
    }
    return Array.from(map.entries())
        .sort(([a], [b]) => a.localeCompare(b, 'ru'))
        .map(([title, data]) => ({
            title,
            data: data.sort((a, b) => {
                const an = a.username || a.link || '';
                const bn = b.username || b.link || '';
                return an.localeCompare(bn, 'ru');
            }),
        }));
}

const AVATAR_INSET = 72;

export default function Contacts() {
    const [query, setQuery] = useState('');
    const [onlyOnline, setOnlyOnline] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const navigation = useNavigation<any>();
    const { user, hydrating, loading } = useUserStore();

    // === handlers (стабильные и с защитой от одинаковых значений)
    const handleQueryChange = useCallback((v: string) => {
        const next = (v ?? '').toString();
        setQuery((prev) => (prev === next ? prev : next));
    }, []);
    const handleToggleOnline = useCallback((v: boolean) => {
        setOnlyOnline((prev) => (prev === !!v ? prev : !!v));
    }, []);
    const handleInvite = useCallback(() => navigation.navigate('Invite'), [navigation]);
    const onOpenProfile = useCallback(
        (u: User) => navigation.navigate('Contact', { contact: u }),
        [navigation],
    );
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 400);
    }, []);

    // === source из relation users
    const source: User[] = useMemo(() => user?.users ?? [], [user]);

    // === фильтрация
    const filtered: User[] = useMemo(() => {
        const q = query.trim().toLowerCase();
        const base = onlyOnline ? source.filter((u) => (u as any).online) : source;
        if (!q) return base;
        return base.filter((u) => {
            const name = (u.username || '').toLowerCase();
            const link = (u.link || '').toLowerCase();
            return name.includes(q) || link.includes(q);
        });
    }, [query, onlyOnline, source]);

    const sections = useMemo(() => groupByInitial(filtered), [filtered]);
    const isBusy = hydrating || loading;

    return (
        <Box flex={1} bg="$backgroundLight" pt="$16">
            <ContactsHeader
                title="Контакты"
                count={filtered.length}
                query={query}
                onQueryChange={handleQueryChange}
                onlyOnline={onlyOnline}
                onToggleOnline={handleToggleOnline}
                onInvite={handleInvite}
            />


            {isBusy ? (
                <HStack mt="$10" justifyContent="center">
                    <Spinner accessibilityLabel="Загрузка" />
                </HStack>
            ) : (
                <SectionList
                    sections={sections}
                    keyExtractor={(item) => String(item.id)}
                    stickySectionHeadersEnabled
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    contentContainerStyle={{ paddingBottom: 24, paddingLeft: 16, paddingRight: 16 }}
                    renderSectionHeader={({ section }) => (
                        <Box bg="$backgroundLight" py="$2">
                            <Text sx={{ color: '#000', fontSize: 17, fontWeight: '600', lineHeight: 22 }}>
                                {section.title}
                            </Text>
                        </Box>
                    )}
                    renderItem={({ item, index, section }) => {
                        const isFirst = index === 0;
                        const isLast = index === section.data.length - 1;
                        return (
                            <Box
                                bg="#F5F5F5"
                                borderTopLeftRadius={isFirst ? 10 : undefined}
                                borderTopRightRadius={isFirst ? 10 : undefined}
                                borderBottomLeftRadius={isLast ? 10 : undefined}
                                borderBottomRightRadius={isLast ? 10 : undefined}
                            >
                                <Pressable
                                    onPress={() => onOpenProfile(item)}
                                    android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
                                >
                                    {({ pressed }) => <Person user={item} pressed={pressed} />}
                                </Pressable>
                            </Box>
                        );
                    }}
                    ItemSeparatorComponent={() => (
                        <HStack height={1} w="100%">
                            <Box w={AVATAR_INSET} h="100%" bg="#F5F5F5" />
                            <Box flex={1} h="100%" bg="#DBDBDC" />
                        </HStack>
                    )}
                    ListEmptyComponent={
                        <VStack mt="$10" space="sm" alignItems="center">
                            <Heading size="md" color="$textLight600">Контактов нет</Heading>
                            <Text color="$textLight500" textAlign="center" maxWidth={240}>
                                Пользователя можно найти с помощью его @vox
                            </Text>
                        </VStack>
                    }
                    ListFooterComponent={<Box h="$6" />}
                />
            )}
        </Box>
    );
}
