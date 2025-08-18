import React, { memo } from 'react';
import { Pressable } from 'react-native';
import {
    Avatar as GSAvatar,
    AvatarFallbackText,
    AvatarImage,
    Icon,
    Box,
} from '@gluestack-ui/themed';
import { User } from 'lucide-react-native';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
    /** Image url */
    src?: string;
    /** Alt text or fallback text (e.g. initials) */
    fallback?: string;
    /** Size */
    size?: AvatarSize;
    /** Press handler (optional) */
    onPress?: () => void;
    /** Rounded shape */
    rounded?: boolean;
    /** Custom placeholder icon */
    iconFallback?: React.ReactNode;
}

const BaseAvatar = memo<AvatarProps>(
    ({ src, fallback, size = 'md', onPress, rounded = true, iconFallback }) => {
        const content = (
            <GSAvatar size={size} borderRadius={rounded ? '$full' : '$md'}>
                {src ? (
                    <AvatarImage source={{ uri: src }} alt={fallback || 'avatar'} />
                ) : fallback ? (
                    <AvatarFallbackText>{fallback}</AvatarFallbackText>
                ) : iconFallback ? (
                    <Box alignItems="center" justifyContent="center" flex={1}>
                        {iconFallback}
                    </Box>
                ) : (
                    <Box alignItems="center" justifyContent="center" flex={1}>
                        <Icon as={User} size="sm" />
                    </Box>
                )}
            </GSAvatar>
        );

        if (onPress) {
            return (
                <Pressable onPress={onPress} accessibilityRole="imagebutton">
                    {content}
                </Pressable>
            );
        }
        return content;
    }
);

BaseAvatar.displayName = 'BaseAvatar';

export default BaseAvatar;

/**
 * USAGE EXAMPLES
 *
 * <Avatar src="https://i.pravatar.cc/150" />
 * <Avatar fallback="BH" size="lg" />
 * <Avatar size="sm" iconFallback={<Icon as={User} />} />
 * <Avatar fallback="JD" onPress={() => alert('Open profile')} />
 */
