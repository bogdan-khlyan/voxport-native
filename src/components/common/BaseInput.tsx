import React, { forwardRef, memo, useMemo, useState } from 'react';
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import {
    Input,
    InputField,
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    FormControlHelper,
    FormControlHelperText,
    FormControlError,
    FormControlErrorText,
    HStack,
    Icon,
    Pressable,
    Spinner,
} from '@gluestack-ui/themed';
import type { IInputProps } from '@gluestack-ui/themed';
import { Eye, EyeOff, X } from 'lucide-react-native';

export type BaseInputSize = 'xs' | 'sm' | 'md' | 'lg';

export interface BaseInputProps {
    /** Controlled value */
    value?: string;
    /** Uncontrolled initial value; switches to controlled if `value` provided */
    defaultValue?: string;
    /** Called on text change */
    onChangeText?: (text: string) => void;
    /** Gluestack input size */
    size?: BaseInputSize;
    /** Label above the input */
    label?: string;
    /** Helper text shown below (when no error) */
    helperText?: string;
    /** Error text shown below (has priority over helperText) */
    errorText?: string;
    /** Marks field as invalid (controls red state) */
    isInvalid?: boolean;
    /** Disables input */
    isDisabled?: boolean;
    /** Shows loading spinner on the right */
    loading?: boolean;
    /** Placeholder */
    placeholder?: string;
    /** Keyboard type */
    keyboardType?: IInputProps['keyboardType'];
    /** Secure text entry (password) */
    secureTextEntry?: boolean;
    /** Enables a password toggle eye icon when secureTextEntry */
    passwordToggle?: boolean;
    /** Clear button (X) on the right */
    clearable?: boolean;
    /** Left icon element */
    leftIcon?: React.ReactNode;
    /** Right icon element (hidden when loading or clearable/password controls visible) */
    rightIcon?: React.ReactNode;
    /** Max length */
    maxLength?: number;
    /** Multiline */
    multiline?: boolean;
    /** Number of lines for multiline */
    numberOfLines?: number;
    /** AutoCapitalize */
    autoCapitalize?: IInputProps['autoCapitalize'];
    /** AutoCorrect */
    autoCorrect?: boolean;
    /** Return key type */
    returnKeyType?: IInputProps['returnKeyType'];
    /** Called on submit editing */
    onSubmitEditing?: IInputProps['onSubmitEditing'];
    /** Test id */
    testID?: string;
    /** Any extra gluestack props for Input root */
    inputProps?: Partial<IInputProps>;
}

const BaseInput = memo(
    forwardRef<any, BaseInputProps>(
        (
            {
                value,
                defaultValue,
                onChangeText,
                size = 'md',
                label,
                helperText,
                errorText,
                isInvalid,
                isDisabled,
                loading,
                placeholder,
                keyboardType,
                secureTextEntry,
                passwordToggle,
                clearable,
                leftIcon,
                rightIcon,
                maxLength,
                multiline,
                numberOfLines,
                autoCapitalize,
                autoCorrect,
                returnKeyType,
                onSubmitEditing,
                testID,
                inputProps,
            },
            ref
        ) => {
            const isControlled = typeof value === 'string';
            const [inner, setInner] = useState<string>(defaultValue ?? '');

            const text = isControlled ? (value as string) : inner;

            const [showPassword, setShowPassword] = useState<boolean>(false);
            const computedSecure = secureTextEntry && !showPassword;

            const hasError = !!errorText || !!isInvalid;

            const handleChange = (t: string) => {
                if (!isControlled) setInner(t);
                onChangeText?.(t);
            };

            const trailingControls = useMemo(() => {
                // Spinner wins
                if (loading) return <Spinner size="small" />;

                // Clear button if allowed and has value
                if (clearable && !!text) {
                    return (
                        <Pressable
                            onPress={() => handleChange('')}
                            accessibilityRole="button"
                            accessibilityLabel="Очистить"
                        >
                            <Icon as={X} size="md" />
                        </Pressable>
                    );
                }

                // Password eye
                if (passwordToggle && secureTextEntry) {
                    return (
                        <Pressable
                            onPress={() => setShowPassword((s) => !s)}
                            accessibilityRole="button"
                            accessibilityLabel={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                        >
                            <Icon as={showPassword ? EyeOff : Eye} size="md" />
                        </Pressable>
                    );
                }

                // Custom right icon as a fallback
                return rightIcon ? <>{rightIcon}</> : null;
            }, [loading, clearable, text, passwordToggle, secureTextEntry, rightIcon, showPassword]);

            return (
                <FormControl isDisabled={isDisabled} isInvalid={hasError}>
                    {label ? (
                        <FormControlLabel>
                            <FormControlLabelText>{label}</FormControlLabelText>
                        </FormControlLabel>
                    ) : null}

                    <Input
                        ref={ref}
                        size={size}
                        isDisabled={isDisabled}
                        isInvalid={hasError}
                        {...inputProps}
                    >
                        {/* Left icon */}
                        {leftIcon ? <HStack alignItems="center" pl="$2">{leftIcon}</HStack> : null}

                        <InputField
                            value={text}
                            onChangeText={handleChange}
                            placeholder={placeholder}
                            keyboardType={keyboardType}
                            secureTextEntry={computedSecure}
                            maxLength={maxLength}
                            multiline={multiline}
                            numberOfLines={numberOfLines}
                            autoCapitalize={autoCapitalize}
                            autoCorrect={autoCorrect}
                            returnKeyType={returnKeyType}
                            onSubmitEditing={onSubmitEditing as unknown as (e: NativeSyntheticEvent<TextInputChangeEventData>) => void}
                            testID={testID}
                        />

                        {/* Right controls (spinner / clear / eye / custom) */}
                        {trailingControls ? (
                            <HStack pr="$2" alignItems="center">{trailingControls}</HStack>
                        ) : null}
                    </Input>

                    {hasError ? (
                        <FormControlError>
                            <FormControlErrorText>{errorText}</FormControlErrorText>
                        </FormControlError>
                    ) : helperText ? (
                        <FormControlHelper>
                            <FormControlHelperText>{helperText}</FormControlHelperText>
                        </FormControlHelper>
                    ) : null}
                </FormControl>
            );
        }
    )
);

BaseInput.displayName = 'BaseInput';

export default BaseInput;

/**
 * USAGE EXAMPLES
 *
 * <BaseInput label="Логин" placeholder="you@voxport.app" leftIcon={<Icon as={Mail} size="sm" />} />
 * <BaseInput label="Пароль" secureTextEntry passwordToggle />
 * <BaseInput label="Поиск" clearable value={query} onChangeText={setQuery} rightIcon={<Icon as={Search} size="sm" />} />
 */
