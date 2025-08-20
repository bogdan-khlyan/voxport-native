import React, { useMemo } from 'react';
import { GestureResponderEvent, View } from 'react-native';
import {
  HStack,
  VStack,
  Text,
  Box,
  Pressable,
  Icon,
} from '@gluestack-ui/themed';
import BaseAvatar from '@/components/common/BaseAvatar';
import { Phone } from 'lucide-react-native';
import CallOffIcon from "@/components/common/icons/CallOffIcon";
import CallInIcon from "@/components/common/icons/CallInIcon";
import {formatCallTime} from "@/utils/formatCallTime";
import PhoneIcon from "@/components/common/icons/PhoneIcon";

export type CallType = 'audio' | 'video';
export type CallStatus = 'incoming' | 'outgoing' | 'missed';

export type CallItemData = {
  id: string;
  name: string;
  username: string;
  type: CallType;
  status: CallStatus;
  date: string;        // например: "Вчера в 22:51"
  durationSec?: number;
};

type Props = {
  item: CallItemData;
  onPressRow?: (item: CallItemData, e?: GestureResponderEvent) => void;
};

const CallItem: React.FC<Props> = ({ item, onPressRow }) => {
  const isMissed = item.status === 'missed';

  const initials =
      item.name
          .split(' ')
          .map((p) => p[0])
          .filter(Boolean)
          .slice(0, 2)
          .join('')
          .toUpperCase() || 'U';

  const directionIcon = useMemo(() => {
    if (isMissed) return <CallOffIcon color="#FF3B30" />;
    if (item.status === 'incoming') return <CallInIcon color="#8E8E93" />;
    return <CallOffIcon color="#8E8E93" />;
  }, [item.status]);

  return (
      <Pressable onPress={(e) => onPressRow?.(item, e)}>
        <HStack
            alignItems="center"
            px="$4"
            py="$3"
            space="md"
            bg="$backgroundLight0"
        >
          {/* Аватар с иконкой звонка поверх (опционально) */}
          <Box position="relative">
            <BaseAvatar fallback={initials} size="md" />
          </Box>

          <VStack flex={1} minWidth={0}>
            <HStack alignItems="center" space="sm">
              <Text
                  size="md"
                  fontWeight="$semibold"
                  color={isMissed ? '#FF3B30' : '$text900'}
                  numberOfLines={1}
              >
                {item.name}
              </Text>
            </HStack>

            <HStack
                alignItems="center"
                space="sm"
                style={{
                  marginTop: 5,
                }}
            >
              {directionIcon}
              <Text
                  size="xs"
                  color={isMissed ? '#FF3B30' : '$textLight600'}
                  style={{
                    fontSize: 15,
                    fontStyle: 'normal',
                    fontWeight: '400',
                    lineHeight: '18px',
                  }}
                  numberOfLines={1}
              >
                {formatCallTime(item.date)}
              </Text>
            </HStack>
          </VStack>

          <PhoneIcon/>
        </HStack>
      </Pressable>
  );
};

export default CallItem;
