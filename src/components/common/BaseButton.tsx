import React, { forwardRef, memo } from 'react';
import { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';
import {
    Button,
    ButtonText,
    HStack,
    Spinner,
    Icon
} from '@gluestack-ui/themed';
import type { IButtonProps } from '@gluestack-ui/themed';

export type BaseButtonVariant = 'solid' | 'outline' | 'link' | 'ghost';
export type BaseButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface BaseButtonProps {
    children?: React.ReactNode;
    /** Text label if you don't pass children */
    label?: string;
    /** Button style variant */
    variant?: BaseButtonVariant;
    /** Button size */
    size?: BaseButtonSize;
    /** Visual intent (maps to Gluestack `action`) */
    intent?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'muted';
    /** Loading state */
    loading?: boolean;
    /** Disable interaction */
    disabled?: boolean;
    /** Expand to 100% width */
    fullWidth?: boolean;
    /** Left icon element (e.g. <Icon as={...} />) */
    leftIcon?: React.ReactNode;
    /** Right icon element */
    rightIcon?: React.ReactNode;
    /** onPress handler */
    onPress?: (event: GestureResponderEvent) => void;
    /** testID for E2E */
    testID?: string;
    /** Style for the root Button */
    style?: StyleProp<ViewStyle>;
    /** Pass-through for any extra Gluestack Button props */
    buttonProps?: Partial<IButtonProps>;
}

const mapIntentToAction = (
    intent: BaseButtonProps['intent']
): IButtonProps['action'] => {
    switch (intent) {
        case 'secondary':
            return 'secondary';
        case 'success':
            return 'success';
        case 'warning':
            return 'warning';
        case 'error':
            return 'error';
        case 'muted':
            return 'muted';
        case 'primary':
        default:
            return 'primary';
    }
};

const BaseButton = memo(
    forwardRef<any, BaseButtonProps>(
        (
            {
                children,
                label,
                variant = 'solid',
                size = 'md',
                intent = 'primary',
                loading = false,
                disabled = false,
                fullWidth = false,
                leftIcon,
                rightIcon,
                onPress,
                testID,
                style,
                buttonProps,
            },
            ref
        ) => {
            const content = (
                <HStack space="sm" alignItems="center">
                    {/* Icons are hidden while loading to keep layout clean */}
                    {!loading && leftIcon ? (
                        typeof leftIcon === 'string' ? (
                            <Icon name={leftIcon as any} />
                        ) : (
                            <>{leftIcon}</>
                        )
                    ) : null}

                    <ButtonText>
                        {children ?? label ?? ''}
                    </ButtonText>

                    {!loading && rightIcon ? (
                        typeof rightIcon === 'string' ? (
                            <Icon name={rightIcon as any} />
                        ) : (
                            <>{rightIcon}</>
                        )
                    ) : null}
                </HStack>
            );

            return (
                <Button
                    ref={ref}
                    variant={variant as IButtonProps['variant']}
                    size={size as IButtonProps['size']}
                    action={mapIntentToAction(intent)}
                    isDisabled={disabled || loading}
                    onPress={onPress}
                    testID={testID}
                    style={[fullWidth && { width: '100%' }, style]}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: disabled || loading, busy: !!loading }}
                    {...buttonProps}
                >
                    {loading ? (
                        <HStack space="sm" alignItems="center">
                            <Spinner size="small" />
                            <ButtonText>{label ?? children ?? ''}</ButtonText>
                        </HStack>
                    ) : (
                        content
                    )}
                </Button>
            );
        }
    )
);

BaseButton.displayName = 'BaseButton';

export default BaseButton;

/**
 * USAGE EXAMPLES
 *
 * <BaseButton label="Join" onPress={join} />
 * <BaseButton variant="outline" intent="success" leftIcon={<Icon as={Check} />}>Save</BaseButton>
 * <BaseButton size="sm" loading fullWidth label="Connecting..." />
 */
