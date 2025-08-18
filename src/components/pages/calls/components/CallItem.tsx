// components/pages/calls/CallItem.tsx
import React, { useMemo } from 'react';
import { GestureResponderEvent } from 'react-native';
import {
  HStack,
  VStack,
  Text,
  Box,
  Pressable,
  Avatar,
  AvatarFallbackText,
  Button,
  ButtonText,
} from '@gluestack-ui/themed';

export type CallType = 'audio' | 'video';
export type CallStatus = 'incoming' | 'outgoing' | 'missed';

export type CallItemData = {
  id: string;
  name: string;
  username: string;
  type: CallType;          // 'audio' | 'video'
  status: CallStatus;      // 'incoming' | 'outgoing' | 'missed'
  date: string;            // например "2025-08-17 09:30" или "ПТ"
  durationSec?: number;    // опционально: длительность в секундах
  // timeLabel?: string;   // если хочешь, можно прокинуть готовый "Вчера", "ПТ", "02.08" и т.п.
};

type Props = {
  item: CallItemData;
  onCallPress?: (item: CallItemData, e?: GestureResponderEvent) => void;
  onInfoPress?: (item: CallItemData, e?: GestureResponderEvent) => void;
  onPressRow?: (item: CallItemData, e?: GestureResponderEvent) => void;
  showDivider?: boolean;
};

const fmtDuration = (s?: number) => {
  if (!s || s <= 0) return '';
  if (s < 60) return `(${s} сек.)`;
  const m = Math.round(s / 60);
  return `(${m} мин.)`;
};

const LeftGlyph: React.FC<{ status: CallStatus }> = ({ status }) => {
  // имитируем иконку звонка iOS: серый кружок с маленьким «телефоном»
  const bg = '$background200';
  const color = '$textLight500';
  return (
      <Box
          width={28}
          height={28}
          rounded="$full"
          alignItems="center"
          justifyContent="center"
          bg={bg}
      >
        {/* минималистичная «трубка» + стрелка направленности */}
        <Text size="xs" color={color}>
          {status === 'incoming' ? '↙︎' : status === 'outgoing' ? '↗︎' : '⎯'}
        </Text>
      </Box>
  );
};

const CallItem: React.FC<Props> = ({ item, onCallPress, onInfoPress, onPressRow, showDivider = true }) => {
  const isMissed = item.status === 'missed';

  const subtitle = useMemo(() => {
    // как в iOS: "Исходящий", "Входящий", "Пропущенный (красным)"
    const base =
        item.status === 'incoming' ? 'Входящий' :
            item.status === 'outgoing' ? 'Исходящий' :
                'Пропущенный';

    const dur = fmtDuration(item.durationSec);
    return dur ? `${base} ${dur}` : base;
  }, [item.status, item.durationSec]);

  return (
      <Pressable onPress={(e) => onPressRow?.(item, e)}>
        <HStack alignItems="center" px="$3" py="$3" space="md">
          {/* Левый индикатор + аватар (как в iOS — маленький глиф + аватар/инициалы) */}
          <HStack space="sm" alignItems="center">
            <LeftGlyph status={item.status} />
            <Avatar size="sm" bg="$background200" borderWidth="$1" borderColor="$borderLight300">
              <AvatarFallbackText>
                {item.name.split(' ').map(p => p[0]).filter(Boolean).slice(0,2).join('').toUpperCase() || 'U'}
              </AvatarFallbackText>
            </Avatar>
          </HStack>

          {/* Центр: имя + подзаголовок */}
          <VStack flex={1} minWidth={0}>
            <HStack alignItems="center" justifyContent="space-between">
              <Text
                  size="md"
                  fontWeight="$semibold"
                  color={isMissed ? '$error600' : '$text900'}
                  numberOfLines={1}
              >
                {item.name}
              </Text>

              {/* Справа — время/дата в приглушённом стиле */}
              <Text size="xs" color="$textLight500" ml="$2" numberOfLines={1}>
                {item.date}
              </Text>
            </HStack>

            <Text
                size="xs"
                color={isMissed ? '$error600' : '$textLight600'}
                numberOfLines={1}
            >
              {subtitle}
            </Text>
          </VStack>

          {/* Кнопки действий справа: iOS показывает "i" в кружке; кнопку вызова делаем по тапу на строку/долгий тап — на твой вкус */}
          <Button
              size="xs"
              variant="outline"
              rounded="$full"
              px="$2.5"
              minWidth={32}
              onPress={(e) => onInfoPress?.(item, e)}
          >
            <ButtonText>i</ButtonText>
          </Button>
        </HStack>

        {/* Разделитель как в нативном списке */}
        {showDivider ? (
            <Box height={1} bg="$borderLight200" mx="$3" />
        ) : null}
      </Pressable>
  );
};

export default CallItem;
