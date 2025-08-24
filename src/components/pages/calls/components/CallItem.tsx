import React, { useMemo } from 'react';
import { GestureResponderEvent } from 'react-native';
import { HStack, VStack, Text, Box, Pressable, Divider } from '@gluestack-ui/themed';
import BaseAvatar from '@/components/common/BaseAvatar';
import { formatCallTime } from '@/utils/formatCallTime';
import PhoneIcon from '@/components/common/icons/PhoneIcon';
import { PhoneIncoming, PhoneOutgoing, PhoneOff, Video as VideoIcon, Phone as PhoneLine } from 'lucide-react-native';

export type CallType = 'audio' | 'video';
export type CallDirection = 'in' | 'out';
export type CallStatus = 'completed' | 'missed' | 'rejected' | 'canceled' | 'ongoing';

export type CallItemData = {
    id: string;
    name?: string;
    username?: string;
    type: CallType;
    direction: CallDirection;
    status: CallStatus;
    date?: string;         // ISO или строка
    durationSec?: number;  // для completed/ongoing (если есть)
};

type Props = {
    item: CallItemData;
    onPressRow?: (item: CallItemData, e?: GestureResponderEvent) => void;
    onCallPress?: (item: CallItemData, e?: GestureResponderEvent) => void;
    showDivider?: boolean;
};

const CallItem: React.FC<Props> = ({ item, onPressRow, onCallPress, showDivider }) => {
    const isMissed   = item.status === 'missed';
    const isOngoing  = item.status === 'ongoing';
    const isRejected = item.status === 'rejected';
    const isCanceled = item.status === 'canceled';
    const isCompleted= item.status === 'completed';

    // безопасное имя
    const displayName = (item.name ?? '').trim() || (item.username ?? '').trim() || 'Без имени';

    // инициалы
    const initials = useMemo(() => {
        const parts = displayName.split(/\s+/).filter(Boolean);
        const init = (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
        return (init || displayName.slice(0, 2) || 'NA').toUpperCase();
    }, [displayName]);

    // форматируем длительность
    const humanDuration = useMemo(() => {
        const s = item.durationSec ?? 0;
        if (!s) return '';
        const m = Math.floor(s / 60);
        const sec = s % 60;
        if (m > 0) return `${m} мин ${sec} с`;
        return `${sec} с`;
    }, [item.durationSec]);

    // текст под именем: статус/направление + дата/время + длительность (если есть)
    const metaText = useMemo(() => {
        const dir = item.direction === 'in' ? 'Входящий' : 'Исходящий';
        const when = item.date ? formatSafely(item.date) : '';

        let statusLabel =
            isMissed   ? 'пропущенный' :
                isRejected ? 'отклонённый' :
                    isCanceled ? 'отменённый'  :
                        isOngoing  ? 'идёт'        :
                            isCompleted? 'завершён'    : '';

        // «Входящий пропущенный • Вчера в 22:51»
        // «Исходящий завершён • 2 мин назад • 1 мин 12 с»
        const parts = [
            [dir, statusLabel].filter(Boolean).join(' '),
            when,
            (isCompleted || isOngoing) && humanDuration ? humanDuration : ''
        ].filter(Boolean);

        return parts.join(' • ');
    }, [item.direction, isMissed, isRejected, isCanceled, isOngoing, isCompleted, humanDuration, item.date]);

    // иконка статуса/направления
    const metaIcon = useMemo(() => {
        if (isMissed)   return <PhoneOff size={18} />;
        if (item.direction === 'in')  return <PhoneIncoming size={18} />;
        return <PhoneOutgoing size={18} />;
    }, [item.direction, isMissed]);

    // цвет мета-текста/иконки по статусу
    const metaColor = isMissed
        ? '#FF3B30'
        : isOngoing
            ? '#34C759'     // зелёный для «идёт»
            : '$textLight600';

    // плашка типа звонка
    const TypePill = (
        <HStack
            alignItems="center"
            px="$2"
            py={2}
            borderRadius="$full"
            bg="$backgroundLight100"
            space="xs"
        >
            {item.type === 'video' ? <VideoIcon size={14} /> : <PhoneLine size={14} />}
            <Text size="xs" color="$textLight700">
                {item.type === 'video' ? 'Видео' : 'Аудио'}
            </Text>
        </HStack>
    );

    return (
        <>
            <Pressable onPress={(e) => onPressRow?.(item, e)}>
                <HStack alignItems="center" px="$4" py="$3" space="md" bg="$backgroundLight0">
                    <Box position="relative">
                        <BaseAvatar fallback={initials} size="md" />
                    </Box>

                    <VStack flex={1} minWidth={0}>
                        <HStack alignItems="center" justifyContent="space-between" space="sm">
                            <Text
                                size="md"
                                fontWeight="$semibold"
                                color={isMissed ? '#FF3B30' : '$text900'}
                                numberOfLines={1}
                            >
                                {displayName}
                            </Text>

                            {/* Плашка типа справа от имени */}
                            {TypePill}
                        </HStack>

                        <HStack alignItems="center" space="sm" style={{ marginTop: 5 }}>
                            <Box mt={1}>
                                {/* иконка направления/статуса */}
                                <Box style={{ opacity: 0.9 }}>
                                    {metaIcon}
                                </Box>
                            </Box>
                            <Text
                                size="xs"
                                color={metaColor as any}
                                style={{ fontSize: 15, fontStyle: 'normal', fontWeight: '400', lineHeight: 18 }}
                                numberOfLines={1}
                                flexShrink={1}
                            >
                                {metaText}
                            </Text>
                        </HStack>
                    </VStack>

                    <Pressable
                        onPress={(e) => onCallPress?.(item, e)}
                        hitSlop={8}
                        accessibilityRole="button"
                        accessibilityLabel={item.type === 'video' ? 'Видео-звонок' : 'Позвонить'}
                    >
                        {/* оставил твой кастомный PhoneIcon; при желании можно подменять на VideoIcon */}
                        {item.type === 'video' ? <VideoIcon /> : <PhoneIcon />}
                    </Pressable>
                </HStack>
            </Pressable>

            {showDivider ? <Divider ml="$4" /> : null}
        </>
    );
};

export default CallItem;

// --- helpers ---
function formatSafely(date: string): string {
    try {
        return formatCallTime(date);
    } catch {
        return '';
    }
}
