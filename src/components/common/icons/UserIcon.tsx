// UserIcon.tsx (React Native)
import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';


type Props = SvgProps & {
    size?: number;          // пиксели
    color?: string;         // цвет обводки
    strokeWidth?: number;   // толщина линии
};

const UserIcon: React.FC<Props> = ({
                                       size = 24,
                                       color = '#0F172A',
                                       strokeWidth = 1.5,
                                       ...props
                                   }) => (
    <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        {...props}
    >
        <Path
            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default UserIcon;
