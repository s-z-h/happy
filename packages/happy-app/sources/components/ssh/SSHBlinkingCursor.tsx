import * as React from 'react';
import { Animated } from 'react-native';
import { sshStyles } from './SSHStyles';

// Mac Terminal style blinking block cursor
// Blinks at ~530ms interval (standard terminal blink rate)
export const SSHBlinkingCursor = React.memo(() => {
    const opacity = React.useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 0,
                    delay: 530,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 0,
                    delay: 530,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [opacity]);

    return (
        <Animated.Text
            style={[sshStyles.cursor, { opacity }]}
            accessibilityElementsHidden={true}
            importantForAccessibility="no"
        >
            {'\u2588'}
        </Animated.Text>
    );
});
SSHBlinkingCursor.displayName = 'SSHBlinkingCursor';
