import { View, type ViewProps } from 'react-native';

type ThemedViewProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
};

function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
    const backgroundColor = lightColor;
    return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

export {
    ThemedView,
    type ThemedViewProps
};