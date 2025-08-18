import React, { memo } from 'react';
import { Linking, TextProps as RNTextProps } from 'react-native';
import { Heading, Text } from '@gluestack-ui/themed';

export type TypographyVariant =
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'body'
    | 'link';

export interface BaseTypographyProps extends RNTextProps {
    variant?: TypographyVariant;
    children: React.ReactNode;
    /** цвет текста */
    color?: string;
    /** href для ссылок */
    href?: string;
    /** выравнивание */
    textAlign?: 'left' | 'center' | 'right';
}

const BaseTypography = memo<BaseTypographyProps>(
    ({ variant = 'body', children, color, href, textAlign, ...rest }) => {
        if (variant.startsWith('h')) {
            const sizeMap: Record<string, '5xl' | '4xl' | '3xl' | '2xl' | 'xl' | 'lg'> = {
                h1: '5xl',
                h2: '4xl',
                h3: '3xl',
                h4: '2xl',
                h5: 'xl',
                h6: 'lg',
            };
            const size = sizeMap[variant];
            return (
                <Heading size={size} color={color} textAlign={textAlign} {...rest}>
                    {children}
                </Heading>
            );
        }

        if (variant === 'link') {
            const handlePress = () => {
                if (href) Linking.openURL(href).catch(() => {});
            };
            return (
                <Text
                    color={color || '$blue600'}
                    textAlign={textAlign}
                    underline
                    onPress={handlePress}
                    accessibilityRole="link"
                    {...rest}
                >
                    {children}
                </Text>
            );
        }

        return (
            <Text color={color} textAlign={textAlign} {...rest}>
                {children}
            </Text>
        );
    }
);

BaseTypography.displayName = 'BaseTypography';

export default BaseTypography;

/**
 * USAGE EXAMPLES
 *
 * <BaseTypography variant="h1">Большой заголовок</BaseTypography>
 * <BaseTypography variant="h3" color="$textLight800">Подзаголовок</BaseTypography>
 * <BaseTypography>Обычный текст абзаца</BaseTypography>
 * <BaseTypography variant="link" href="https://voxport.app">Перейти на сайт</BaseTypography>
 */
