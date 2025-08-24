// App.tsx
import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Gluestack
import { GluestackUIProvider, Box, Text } from '@gluestack-ui/themed';
import { StyledProvider } from '@gluestack-style/react';
import { config } from '@gluestack-ui/config';

// Экраны
import Meeting from './components/pages/meeting/Meeting';
import Login from './components/pages/login/Login';
import Auth from './components/pages/auth/Auth';
import Invite from './components/pages/invite/Invite';

// Навигатор вкладок
import TabsNav from "./components/layouts/TabsNav";

// Redux
import { Provider } from 'react-redux';
import { store, useUserStore } from './api/user/user.store';

console.log('BOOT', { __DEV__ });


const RootStack = createStackNavigator();

// --- Гейт авторизации на Redux ---
function RootGate() {
    const { hydrating, isAuthed, hydrate } = useUserStore();

    useEffect(() => {
        // Гидратация профиля из AsyncStorage при старте
        hydrate();
    }, [hydrate]);

    if (hydrating) {
        return (
            <Box flex={1} alignItems="center" justifyContent="center">
                <Text>Загрузка…</Text>
            </Box>
        );
    }

    // Если твой Auth уже сам диспатчит login(thunk), проп onDone не нужен.
    // Если в Auth всё ещё ждёшь onDone — передаём no-op, чтобы не падало.
    return isAuthed ? (
        <TabsNav />
    ) : (
        <Auth onDone={() => { /* no-op: переход произойдёт по изменению isAuthed */ }} />
    );
}

const theme =  {
    dark: false,
    colors: {
        primary: 'rgb(0, 122, 255)',
        // background: 'rgb(242, 242, 242)',
        background: '#FFFFFF',
        card: 'rgb(255, 255, 255)',
        text: 'rgb(28, 28, 30)',
        border: 'rgb(216, 216, 216)',
        notification: 'rgb(255, 59, 48)',
    },
}

export default function App() {
    return (
        <Provider store={store}>
            <StyledProvider config={config}>
                <GluestackUIProvider config={config}>
                    <NavigationContainer theme={theme}>
                        <RootStack.Navigator initialRouteName="Gate" screenOptions={{ headerShown: false }}>
                            <RootStack.Screen name="Gate" component={RootGate} />
                            <RootStack.Screen name="Meeting" component={Meeting} options={{ presentation: 'modal' }} />
                            <RootStack.Screen name="Login" component={Login} />
                            <RootStack.Screen
                                name="Invite"
                                component={Invite}
                                options={{ presentation: 'modal', headerShown: false }}
                            />
                        </RootStack.Navigator>
                    </NavigationContainer>
                </GluestackUIProvider>
            </StyledProvider>
        </Provider>
    );
}
