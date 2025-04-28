import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, ViewStyle } from 'react-native';

const MAPPING = {
    'house.fill': 'home',
    'paperplane.fill': 'send',
    'chevron.left.forwardslash.chevron.right': 'code',
    'chevron.right': 'chevron-right',
    'person.fill': 'person',
    'flame.fill': 'local-fire-department',
    'gearshape.fill': 'settings',
    'star.fill': 'star',
    'book.closed.fill': 'book',
    'rectangle.portrait.and.arrow.right': 'logout',
    'globe': 'language',
    'chevron.down': 'keyboard-arrow-down',
    'xmark.circle.fill': 'cancel',
    'checkmark.circle.fill': 'check-circle',
    'flag.fill': 'flag',
    'trophy.fill': 'emoji-events',
    'medal.fill': 'military-tech',
    'textbook.fill': 'book',
} as Partial<Record<
    import('expo-symbols').SymbolViewProps['name'],
    React.ComponentProps<typeof MaterialIcons>['name']
>>;

type IconSymbolName = keyof typeof MAPPING;

function IconSymbol({
    name,
    size = 24,
    color,
    style,
}: {
    name: IconSymbolName;
    size?: number;
    color: string | OpaqueColorValue;
    style?: StyleProp<ViewStyle>;
    weight?: SymbolWeight;
}) {
    // @ts-ignore
    return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}


export {
    IconSymbol,
    type IconSymbolName,
}