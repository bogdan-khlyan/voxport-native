import React, { memo } from 'react';
import { GestureResponderEvent, Insets } from 'react-native';
import { Icon, Pressable, Box } from '@gluestack-ui/themed';
import {
    PhoneOff,
    Phone,
    Mic,
    MicOff,
    Video,
    VideoOff,
    Volume2,
    VolumeX,
} from 'lucide-react-native';

export type CallButtonType = 'end' | 'answer' | 'mute' | 'video' | 'speaker';

export interface BaseCallButtonProps {
    type: CallButtonType;
    /** active state for toggle buttons (mute/video/speaker) */
    active?: boolean;
    /** circular button diameter in px */
    size?: number;
    onPress?: (event: GestureResponderEvent) => void;
    /** increases touch area without changing visual size */
    hitSlop?: Insets;
}

/**
 * NOTE: Use Gluestack tokens via component props (bg, rounded, etc.),
 * not plain RN style backgroundColor with a token string.
 * That was the reason backgrounds looked transparent before.
 */
const BaseCallButton = memo<BaseCallButtonProps>(
    ({ type, active, size = 64, onPress, hitSlop }) => {
        let bgToken: string = '$gray600';
        let IconComp: any = Phone;

        switch (type) {
            case 'end':
                bgToken = '$red600';
                IconComp = PhoneOff;
                break;
            case 'answer':
                bgToken = '$green600';
                IconComp = Phone;
                break;
            case 'mute':
                bgToken = active ? '$red500' : '$gray600';
                IconComp = active ? MicOff : Mic;
                break;
            case 'video':
                bgToken = active ? '$red500' : '$gray600';
                IconComp = active ? VideoOff : Video;
                break;
            case 'speaker':
                bgToken = active ? '$green500' : '$gray600';
                IconComp = active ? Volume2 : VolumeX;
                break;
        }

        return (
            <Pressable
                onPress={onPress}
                accessibilityRole="button"
                hitSlop={hitSlop ?? { top: 8, left: 8, right: 8, bottom: 8 }}
            >
                <Box
                    bg={bgToken}
                    rounded="$full"
                    alignItems="center"
                    justifyContent="center"
                    // width/height as numeric style is OK; tokens are for colors/spacing
                    style={{ width: size, height: size }}
                >
                    <Icon as={IconComp} color="$white" size="xl" />
                </Box>
            </Pressable>
        );
    }
);

BaseCallButton.displayName = 'BaseCallButton';

export default BaseCallButton;

/**
 * USAGE EXAMPLES
 *
 * <BaseCallButton type="end" onPress={hangup} />
 * <BaseCallButton type="answer" onPress={answer} />
 * <BaseCallButton type="mute" active={muted} onPress={toggleMute} />
 * <BaseCallButton type="video" active={videoOff} onPress={toggleVideo} />
 * <BaseCallButton type="speaker" active={speakerOn} onPress={toggleSpeaker} />
 */
