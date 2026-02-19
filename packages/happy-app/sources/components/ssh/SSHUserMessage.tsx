import * as React from 'react';
import { View, Text } from 'react-native';
import { UserTextMessage } from '@/sync/typesMessage';
import { sshStyles } from './SSHStyles';

// Mac Terminal style: user@hostname:~$
export const SSHUserMessage = React.memo((props: {
    message: UserTextMessage;
    sessionId: string;
}) => {
    const displayText = props.message.displayText || props.message.text;

    if (!displayText.trim()) {
        return null;
    }

    return (
        <View
            style={sshStyles.messageRow}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={`Command: ${displayText}`}
        >
            <View style={sshStyles.commandLine}>
                <Text style={sshStyles.promptUser}>user@happy</Text>
                <Text style={sshStyles.promptPath}>:~$ </Text>
                <Text selectable={true} style={sshStyles.userInputText}>{displayText}</Text>
            </View>
        </View>
    );
});
SSHUserMessage.displayName = 'SSHUserMessage';
