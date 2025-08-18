// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Gluestack
import { GluestackUIProvider, Box, Text } from '@gluestack-ui/themed';
import { StyledProvider } from '@gluestack-style/react';
import { config } from '@gluestack-ui/config';

// Экраны
import Meeting from './components/pages/meeting/Meeting';
import Login from './components/pages/login/Login';
import Auth, { STORAGE_KEYS } from './components/pages/auth/Auth';

// Навигатор вкладок (наш вынесенный компонент)
import TabsNav from "./components/layouts/TabsNav";

const RootStack = createStackNavigator();

// --- Гейт авторизации ---
function RootGate() {
    const [ready, setReady] = useState(false);
    const [hasProfile, setHasProfile] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const raw = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
                setHasProfile(!!raw);
                setHasProfile(false);
            } finally {
                setReady(true);
            }
        })();
    }, []);

    if (!ready) {
        return (
            <Box flex={1} alignItems="center" justifyContent="center">
                <Text>Загрузка…</Text>
            </Box>
        );
    }

    return hasProfile ? <TabsNav /> : <Auth onDone={() => setHasProfile(true)} />;
}

export default function App() {
    return (
        <StyledProvider config={config}>
            <GluestackUIProvider config={config}>
                <NavigationContainer theme={DefaultTheme}>
                    <RootStack.Navigator initialRouteName="Gate" screenOptions={{ headerShown: false }}>
                        {/* Гейт: Auth при первом запуске, иначе Tabs */}
                        <RootStack.Screen name="Gate" component={RootGate} />

                        {/* Экран звонка поверх вкладок */}
                        <RootStack.Screen name="Meeting" component={Meeting} options={{ presentation: 'modal' }} />

                        {/* Доп. экраны */}
                        <RootStack.Screen name="Login" component={Login} />
                    </RootStack.Navigator>
                </NavigationContainer>
            </GluestackUIProvider>
        </StyledProvider>
    );
}
