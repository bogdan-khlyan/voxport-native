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
  Icon,
} from '@gluestack-ui/themed';
import { PhoneIcon } from 'react-native-heroicons/solid';
import BaseAvatar from "@/components/common/BaseAvatar";

export type CallType = 'audio' | 'video';
export type CallStatus = 'incoming' | 'outgoing' | 'missed';

export type CallItemData = {
  id: string;
  name: string;
  username: string;
  type: CallType;
  status: CallStatus;
  date: string;
  durationSec?: number;
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

const CallItem: React.FC<Props> = ({
                                     item,
                                     onCallPress,
                                     onInfoPress,
                                     onPressRow,
                                     showDivider = true,
                                   }) => {
  const isMissed = item.status === 'missed';

  const subtitle = useMemo(() => {
    const base =
        item.status === 'incoming'
            ? 'Входящий'
            : item.status === 'outgoing'
                ? 'Исходящий'
                : 'Пропущенный';

    const dur = fmtDuration(item.durationSec);
    return dur ? `${base} ${dur}` : base;
  }, [item.status, item.durationSec]);

  const initials =
      item.name
          .split(' ')
          .map((p) => p[0])
          .filter(Boolean)
          .slice(0, 2)
          .join('')
          .toUpperCase() || 'U';

  return (
      <Pressable onPress={(e) => onPressRow?.(item, e)}>
        <HStack alignItems="center" px="$4" py="$3" space="md" bg="$backgroundLight0">
          <BaseAvatar fallback={initials} size="md" />

          {/* Имя и подзаголовок */}
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

          {/* Кнопка звонка справа */}
          <Pressable
              onPress={(e) => onCallPress?.(item, e)}
              px="$2"
              py="$2"
              bg="white"
              borderRadius={6}
          >
            <Icon as={PhoneIcon} size="sm" color="$textLight700" />
          </Pressable>
        </HStack>

        {/* Разделитель */}
        {showDivider ? <Box height={1} bg="$borderLight200" mx="$4" /> : null}
      </Pressable>
  );
};

export default CallItem;
