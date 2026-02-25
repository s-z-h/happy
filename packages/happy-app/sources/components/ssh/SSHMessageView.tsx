import * as React from 'react';
import { View } from 'react-native';
import { Message } from '@/sync/typesMessage';
import { Metadata } from '@/sync/storageTypes';
import { SSHUserMessage } from './SSHUserMessage';
import { SSHAgentMessage } from './SSHAgentMessage';
import { SSHToolCallBlock } from './SSHToolCallBlock';
import { SSHAgentEventBlock } from './SSHAgentEventBlock';
import { sshStyles } from './SSHStyles';

export const SSHMessageView = React.memo((props: {
    message: Message;
    metadata: Metadata | null;
    sessionId: string;
}) => {
    return (
        <View style={sshStyles.terminalContainer}>
            <SSHRenderBlock
                message={props.message}
                metadata={props.metadata}
                sessionId={props.sessionId}
            />
        </View>
    );
});
SSHMessageView.displayName = 'SSHMessageView';

// Exported so SSHToolCallBlock can recursively render children
export function SSHRenderBlock(props: {
    message: Message;
    metadata: Metadata | null;
    sessionId: string;
}): React.ReactElement | null {
    switch (props.message.kind) {
        case 'user-text':
            return <SSHUserMessage message={props.message} sessionId={props.sessionId} />;

        case 'agent-text':
            return <SSHAgentMessage message={props.message} sessionId={props.sessionId} />;

        case 'tool-call':
            return (
                <SSHToolCallBlock
                    message={props.message}
                    metadata={props.metadata}
                    sessionId={props.sessionId}
                />
            );

        case 'agent-event':
            return <SSHAgentEventBlock event={props.message.event} metadata={props.metadata} />;

        default:
            // Safe fallback: log warning instead of crashing
            if (__DEV__) {
                console.warn(`SSHMessageView: Unknown message kind: ${(props.message as any)?.kind}`);
            }
            return null;
    }
}
