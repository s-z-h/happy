import * as React from 'react';
import { View, Text } from 'react-native';
import { ToolCallMessage } from '@/sync/typesMessage';
import { Metadata } from '@/sync/storageTypes';
import { sshStyles } from './SSHStyles';
import { SSHBlinkingCursor } from './SSHBlinkingCursor';
import { SSHRenderBlock } from './SSHMessageView';
import { PermissionFooter } from '../tools/PermissionFooter';

const MAX_RESULT_LENGTH = 1000;

export const SSHToolCallBlock = React.memo((props: {
    message: ToolCallMessage;
    metadata: Metadata | null;
    sessionId: string;
}) => {
    const { tool } = props.message;
    if (!tool) {
        return null;
    }

    // For Bash tools, show as real command execution
    const isBash = tool.name === 'Bash';
    const command = isBash && tool.input?.command
        ? tool.input.command
        : null;

    const toolDescription = tool.description || '';

    const hasResult = tool.state === 'completed' && tool.result;
    const hasError = tool.state === 'error';

    const fullText = hasResult
        ? (typeof tool.result === 'string' ? tool.result : JSON.stringify(tool.result))
        : null;
    const isTruncated = fullText !== null && fullText.length > MAX_RESULT_LENGTH;
    const resultText = fullText ? fullText.slice(0, MAX_RESULT_LENGTH) : null;

    // Permission handling
    const showPermission = tool.permission && tool.name !== 'AskUserQuestion';

    // Render children (sub-agent messages)
    const hasChildren = props.message.children && props.message.children.length > 0;

    if (isBash && command) {
        // Bash: render like real terminal command execution
        return (
            <View
                style={sshStyles.toolContainer}
                accessible={true}
                accessibilityRole="text"
                accessibilityLabel={`Command: ${command}`}
            >
                {/* Command prompt */}
                <View style={sshStyles.commandLine}>
                    <Text style={sshStyles.promptUser}>happy</Text>
                    <Text style={sshStyles.promptPath}>:~$ </Text>
                    <Text selectable={true} style={sshStyles.toolInput}>{command}</Text>
                </View>

                {/* Output */}
                {resultText && (
                    <Text selectable={true} style={sshStyles.toolResult}>{resultText}</Text>
                )}
                {isTruncated && (
                    <Text style={sshStyles.truncatedText}>{'... [truncated]'}</Text>
                )}

                {hasError && tool.result && (
                    <Text selectable={true} style={sshStyles.toolError}>{String(tool.result)}</Text>
                )}

                {/* Running indicator */}
                {tool.state === 'running' && !showPermission && (
                    <SSHBlinkingCursor />
                )}

                {/* Permission prompt */}
                {showPermission && (
                    <PermissionFooter
                        permission={tool.permission!}
                        sessionId={props.sessionId}
                        toolName={tool.name}
                        toolInput={tool.input}
                        metadata={props.metadata}
                    />
                )}

                {/* Children (sub-agent messages) */}
                {hasChildren && (
                    <View style={sshStyles.childrenContainer}>
                        {props.message.children.map(child => (
                            <SSHRenderBlock
                                key={child.id}
                                message={child}
                                metadata={props.metadata}
                                sessionId={props.sessionId}
                            />
                        ))}
                    </View>
                )}
            </View>
        );
    }

    // Non-Bash tools: show as annotated system call
    return (
        <View
            style={sshStyles.toolContainer}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={`Tool: ${tool.name}`}
        >
            <View style={sshStyles.toolHeader}>
                <Text style={sshStyles.toolPrefix}>{'>>> '}</Text>
                <Text style={sshStyles.toolName}>{tool.name}</Text>
                {toolDescription ? (
                    <Text style={sshStyles.toolResult} numberOfLines={1}>{' — ' + toolDescription}</Text>
                ) : null}
            </View>

            {resultText && (
                <Text selectable={true} style={sshStyles.toolResult}>{resultText}</Text>
            )}
            {isTruncated && (
                <Text style={sshStyles.truncatedText}>{'... [truncated]'}</Text>
            )}

            {hasError && tool.result && (
                <Text selectable={true} style={sshStyles.toolError}>{String(tool.result)}</Text>
            )}

            {tool.state === 'running' && !showPermission && (
                <SSHBlinkingCursor />
            )}

            {/* Permission prompt */}
            {showPermission && (
                <PermissionFooter
                    permission={tool.permission!}
                    sessionId={props.sessionId}
                    toolName={tool.name}
                    toolInput={tool.input}
                    metadata={props.metadata}
                />
            )}

            {/* Children (sub-agent messages) */}
            {hasChildren && (
                <View style={sshStyles.childrenContainer}>
                    {props.message.children.map(child => (
                        <SSHRenderBlock
                            key={child.id}
                            message={child}
                            metadata={props.metadata}
                            sessionId={props.sessionId}
                        />
                    ))}
                </View>
            )}
        </View>
    );
});
SSHToolCallBlock.displayName = 'SSHToolCallBlock';
