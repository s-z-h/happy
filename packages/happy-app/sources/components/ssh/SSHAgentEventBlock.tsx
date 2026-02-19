import * as React from 'react';
import { View, Text } from 'react-native';
import { AgentEvent } from '@/sync/typesRaw';
import { Metadata } from '@/sync/storageTypes';
import { t } from '@/text';
import { sshStyles } from './SSHStyles';

function formatTime(timestamp: number): string {
    try {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
        return t('message.unknownTime');
    }
}

export const SSHAgentEventBlock = React.memo((props: {
    event: AgentEvent;
    metadata: Metadata | null;
}) => {
    let eventText: string;

    if (props.event.type === 'switch') {
        eventText = t('message.switchedToMode', { mode: props.event.mode });
    } else if (props.event.type === 'message') {
        eventText = props.event.message;
    } else if (props.event.type === 'limit-reached') {
        eventText = t('message.usageLimitUntil', { time: formatTime(props.event.endsAt) });
    } else if (props.event.type === 'ready') {
        return null;
    } else {
        if (__DEV__) {
            console.warn(`SSHAgentEventBlock: unhandled event type: ${(props.event as any).type}`);
        }
        eventText = t('message.unknownEvent');
    }

    return (
        <View
            style={sshStyles.systemLine}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={`System event: ${eventText}`}
        >
            <Text style={sshStyles.systemPrefix}>--- </Text>
            <Text selectable={true} style={sshStyles.systemText}>{eventText}</Text>
        </View>
    );
});
SSHAgentEventBlock.displayName = 'SSHAgentEventBlock';
