import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const MS_IN_MINUTE = 60 * 1000;
const MS_IN_HOUR = 60 * MS_IN_MINUTE;
const MS_IN_DAY = 24 * MS_IN_HOUR;

export function formatCallTime(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now.getTime() - date.getTime();

    const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    const isYesterday =
        date.getDate() === now.getDate() - 1 &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    if (diff < 1 * MS_IN_MINUTE) return 'Только что';
    if (diff < 60 * MS_IN_MINUTE)
        return `${Math.floor(diff / MS_IN_MINUTE)} минут назад`;
    if (diff < 24 * MS_IN_HOUR && isToday)
        return `Сегодня в ${format(date, 'HH:mm')}`;
    if (diff < 48 * MS_IN_HOUR && isYesterday)
        return `Вчера в ${format(date, 'HH:mm')}`;
    if (diff < 24 * MS_IN_HOUR)
        return `${Math.floor(diff / MS_IN_HOUR)} часов назад`;

    return format(date, 'dd.MM.yyyy HH:mm', { locale: ru });
}
