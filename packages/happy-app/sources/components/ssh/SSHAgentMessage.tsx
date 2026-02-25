import * as React from 'react';
import { View } from 'react-native';
import { AgentTextMessage } from '@/sync/typesMessage';
import { useSetting } from '@/sync/storage';
import { sync } from '@/sync/sync';
import { MarkdownView } from '../markdown/MarkdownView';
import { Option } from '../markdown/MarkdownView';
import { sshStyles } from './SSHStyles';

export const SSHAgentMessage = React.memo((props: {
    message: AgentTextMessage;
    sessionId: string;
}) => {
    const experiments = useSetting('experiments');

    const handleOptionPress = React.useCallback((option: Option) => {
        sync.sendMessage(props.sessionId, option.title);
    }, [props.sessionId]);

    // Hide thinking messages unless experiments is enabled
    if (props.message.isThinking && !experiments) {
        return null;
    }

    if (!props.message.text.trim()) {
        return null;
    }

    return (
        <View
            style={[sshStyles.messageRow, props.message.isThinking && { opacity: 0.3 }]}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel="Agent response"
        >
            <MarkdownView markdown={props.message.text} onOptionPress={handleOptionPress} />
        </View>
    );
});
SSHAgentMessage.displayName = 'SSHAgentMessage';
