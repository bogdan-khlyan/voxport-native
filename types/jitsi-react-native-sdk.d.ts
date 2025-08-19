// types/jitsi-react-native-sdk.d.ts
import * as React from 'react';

declare module '@jitsi/react-native-sdk' {
    export type JitsiEventMap = {
        onReadyToClose: () => void;
        onEndpointTextMessageReceived?: (event: { name: string; data?: unknown }) => void;
        onEndpointMessageReceived?: (event?: unknown) => void;
        // добавляй сюда обработчики по мере необходимости
    };

    export type JitsiMeetingRef = {
        close?: () => void;
        // при необходимости добавь другие методы, если SDK их даёт
    };

    export type JitsiConfig = Partial<{
        prejoinPageEnabled: boolean;
        hideConferenceTimer: boolean;
        startWithVideoMuted: boolean;
        startWithAudioMuted: boolean;
    }>;

    export type JitsiFlags = Partial<Record<string, boolean>>;

    export type JitsiUserInfo = {
        displayName?: string;
        email?: string;
        avatar?: string;
    };

    export interface JitsiMeetingProps {
        room: string;
        serverURL?: string;
        userInfo?: JitsiUserInfo;
        config?: JitsiConfig;
        flags?: JitsiFlags;
        eventListeners?: Partial<JitsiEventMap>;
        style?: object;
    }

    export const JitsiMeeting: React.ForwardRefExoticComponent<
        JitsiMeetingProps & React.RefAttributes<JitsiMeetingRef>
    >;
}
