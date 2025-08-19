import React, { useCallback, useRef } from 'react';
import { JitsiMeeting } from '@jitsi/react-native-sdk';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useUserStore } from '@/api/user/user.store';

type RootStackParamList = {
    Contacts: undefined;
    Meeting: { room: string };
};

type MeetingProps = { route: { params: { room: string } } };

type UserProfile = { nickname?: string; username?: string };

type UserState = {
    nickname?: string;
    username?: string;
    name?: string;
    email?: string;
    avatarUrl?: string;
    avatar?: string;
    photoUrl?: string;
    profile?: UserProfile;
};

const isHttpUrl = (v: unknown): v is string =>
    typeof v === 'string' && /^(https?:)?\/\//.test(v);

// минимальный тип, чтобы можно было безопасно вызвать close()
type JitsiRef = { close?: () => void } | null;

const Meeting: React.FC<MeetingProps> = ({ route }) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { room } = route.params;

    // TS2554 fix: без селектора
    const store = useUserStore() as Partial<UserState> | undefined;

    // TS2322 fix: берём только нужные поля из стора (отсекаем методы типа hydrate)
    const raw: Partial<UserState> = {
        nickname: store?.nickname,
        username: store?.username,
        name: store?.name,
        email: store?.email,
        avatarUrl: store?.avatarUrl,
        avatar: store?.avatar,
        photoUrl: store?.photoUrl,
        profile: store?.profile,
    };

    const baseName =
        raw.nickname ??
        raw.username ??
        raw.profile?.nickname ??
        raw.profile?.username ??
        raw.name ??
        (typeof raw.email === 'string' ? raw.email.split('@')[0] : undefined);

    const displayName = (baseName ?? 'Guest').toString().trim() || 'Guest';

    const email =
        typeof raw.email === 'string' && raw.email.includes('@') ? raw.email : undefined;

    const maybeAvatar = raw.avatarUrl ?? raw.avatar ?? raw.photoUrl;
    const avatar = isHttpUrl(maybeAvatar) ? maybeAvatar : undefined;

    const jitsiMeeting = useRef<JitsiRef>(null);
    const setJitsiRef = useCallback((inst: unknown) => {
        jitsiMeeting.current = (inst as JitsiRef) ?? null;
    }, []);

    const onReadyToClose = useCallback(() => {
        navigation.navigate('Contacts');
        jitsiMeeting.current?.close?.();
    }, [navigation]);

    const onEndpointMessageReceived = useCallback(() => {
        console.log('You got a message!');
    }, []);

    const eventListeners: Record<string, (...a: unknown[]) => void> = {
        onReadyToClose,
        onEndpointMessageReceived,
    };

    return (
        <JitsiMeeting
            config={{
                prejoinPageEnabled: false, // автологин в комнату
                hideConferenceTimer: true,
                startWithVideoMuted: true, // видео выкл по умолчанию
                // startWithAudioMuted: true, // раскомментируй при необходимости
            }}
            eventListeners={eventListeners}
            flags={{
                'prejoinpage.enabled': false,
                'pip.enabled': true,
                'conference-timer.enabled': true,
                'fullscreen.enabled': false,
                'close-captions.enabled': false,
            }}
            userInfo={{ displayName, email, avatarURL: avatar }} // если у твоей версии ключ avatarUrl — смени здесь
            ref={setJitsiRef} // callback-ref — совместим с LegacyRef<...>
            style={{ flex: 1 }}
            room={room}
            serverURL="https://meet.voxport.net/"
        />
    );
};

export default Meeting;
