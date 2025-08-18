// components/navigation/TabsNav.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import {
    UserCircleIcon,
    PhoneIcon,
    ChatBubbleLeftIcon,
    CogIcon
} from 'react-native-heroicons/solid';

// Экраны
import Contacts from '../pages/contacts/Contacts';
import ContactDetails from '../pages/contacts-details/ContactsDetails';
import Calls from '../pages/calls/Calls';
import Chats from '../pages/chats/Chats';
import Settings from '../pages/settings/Settings';

const Tab = createBottomTabNavigator();
const ContactsStack = createStackNavigator();
const CallsStack = createStackNavigator();
const ChatsStack = createStackNavigator();
const SettingsStack = createStackNavigator();

function ContactsStackNav() {
    return (
        <ContactsStack.Navigator screenOptions={{ headerShown: false }}>
            <ContactsStack.Screen name="Contacts" component={Contacts} />
            <ContactsStack.Screen name="Contact" component={ContactDetails} />
        </ContactsStack.Navigator>
    );
}

function CallsStackNav() {
    return (
        <CallsStack.Navigator screenOptions={{ headerShown: false }}>
            <CallsStack.Screen name="Calls" component={Calls} />
        </CallsStack.Navigator>
    );
}

function ChatsStackNav() {
    return (
        <ChatsStack.Navigator screenOptions={{ headerShown: false }}>
            <ChatsStack.Screen name="Chats" component={Chats} />
        </ChatsStack.Navigator>
    );
}

function SettingsStackNav() {
    return (
        <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
            <SettingsStack.Screen name="Settings" component={Settings} />
        </SettingsStack.Navigator>
    );
}

export default function TabsNav() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#F5F5F5',
                },
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: '#999999',
                tabBarShowLabel: false, // скрываем подписи
            }}
        >
            <Tab.Screen
                name="Contacts"
                component={ContactsStackNav}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <UserCircleIcon color={color} size={size as number} />
                    ),
                }}
            />
            <Tab.Screen
                name="CallsTab"
                component={CallsStackNav}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <PhoneIcon color={color} size={size as number} />
                    ),
                }}
            />
            <Tab.Screen
                name="ChatsTab"
                component={ChatsStackNav}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <ChatBubbleLeftIcon color={color} size={size as number} />
                    ),
                }}
            />
            <Tab.Screen
                name="SettingsTab"
                component={SettingsStackNav}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <CogIcon color={color} size={size as number} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
