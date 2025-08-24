// Contacts.tsx
import React, {
    useMemo,
    useState,
    useCallback,
    useEffect,
    useRef,
} from 'react';
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
import { useNavigation } from '@react-navigation/native';
import ContactsHeader from './components/ContactsHeader';
import Person from './components/Person';
import { useUserStore } from '@/api/user/user.store';

type Contact = {
    id: string;
    name: string;
    email: string;
    online?: boolean;
};

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

const AVATAR_INSET = 72;

export default function Contacts() {
    const [query, setQuery] = useState('');
    const [onlyOnline, setOnlyOnline] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const navigation = useNavigation<any>();
    const { user, hydrating, loading, hydrate } = useUserStore();

    // --- 1) hydrate строго один раз (включая StrictMode) ---
    const didHydrateRef = useRef(false);
    useEffect(() => {
        if (!didHydrateRef.current) {
            didHydrateRef.current = true;
            // не await — эффект
            hydrate();
        }
    }, [hydrate]);

    // --- 2) маппим user.relation users -> Contact[] ---
    const source: Contact[] = useMemo(() => {
        const list = user?.users ?? [];
        return list.map((u) => ({
            id: String(u.id),
            name: u.username || 'Без имени',
            email: u.link || u.username || '@user',
            online: (u as any).online ?? false,
        }));
    }, [user]);

    // --- 3) фильтрация + группировка ---
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const base = onlyOnline ? source.filter((c) => c.online) : source;
        return q
            ? base.filter(
                (c) =>
                    c.name.toLowerCase().includes(q) ||
                    c.email.toLowerCase().includes(q),
            )
            : base;
    }, [query, onlyOnline, source]);

    const sections = useMemo(() => groupByInitial(filtered), [filtered]);

    // --- 4) коллбеки с защитой от «одинаковых» сетов ---
    const handleQueryChange = useCallback((v: string) => {
        const next = (v ?? '').toString();
        setQuery((prev) => (prev === next ? prev : next));
    }, []);

    const handleToggleOnline = useCallback((v: boolean) => {
        setOnlyOnline((prev) => (prev === !!v ? prev : !!v));
    }, []);

    const handleInvite = useCallback(
        () => navigation.navigate('Invite'),
        [navigation],
    );

    const onOpenProfile = useCallback(
        (c: Contact) => navigation.navigate('Contact', { contact: c }),
        [navigation],
    );

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await hydrate();
        } finally {
            setRefreshing(false);
        }
    }, [hydrate]);

    const isBusy = hydrating || loading;

    return (
        <Box flex={1} bg="$backgroundLight" pt="$16">
            {/* 5) Пока идёт первичная гидратация — не рендерим Header вовсе */}
            {didHydrateRef.current && !hydrating && (
                <ContactsHeader
                    title="Контакты"
                    count={filtered.length}
                    query={query}
                    onQueryChange={handleQueryChange}
                    onlyOnline={onlyOnline}
                    onToggleOnline={handleToggleOnline}
                    onInvite={handleInvite}
                />
            )}

            {/* Если первичная гидратация — покажем спиннер полноэкранно */}
            {!didHydrateRef.current || hydrating ? (
                <HStack mt="$10" justifyContent="center">
                    <Spinner accessibilityLabel="Загрузка" />
                </HStack>
            ) : (
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
                    renderItem={({ item, index, section }) => {
                        const isFirst = index === 0;
                        const isLast = index === section.data.length - 1;
                        return (
                            <Box
                                bg={'#F5F5F5'}
                                borderTopLeftRadius={isFirst ? 10 : undefined}
                                borderTopRightRadius={isFirst ? 10 : undefined}
                                borderBottomLeftRadius={isLast ? 10 : undefined}
                                borderBottomRightRadius={isLast ? 10 : undefined}
                            >
                                <Pressable
                                    onPress={() => onOpenProfile(item)}
                                    android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
                                >
                                    {({ pressed }) => (
                                        <Person
                                            name={item.name}
                                            email={item.email}
                                            pressed={pressed}
                                        />
                                    )}
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
                        isBusy ? (
                            <HStack mt="$10" justifyContent="center">
                                <Spinner accessibilityLabel="Загрузка" />
                            </HStack>
                        ) : (
                            <VStack mt="$10" space="sm" alignItems="center">
                                <Heading size="md" color="$textLight600">
                                    Контактов нет
                                </Heading>
                                <Text color="$textLight500" textAlign="center">
                                    Создайте контакт или используйте поиск.
                                </Text>
                            </VStack>
                        )
                    }
                    ListFooterComponent={<Box h="$6" />}
                />
            )}
        </Box>
    );
}
