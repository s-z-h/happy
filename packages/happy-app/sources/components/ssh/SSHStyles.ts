import { Platform } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

// Mac Terminal uses Menlo 12pt by default
export const MONO_FONT = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'Menlo, Consolas, monospace' });
const FONT_SIZE = 13;
const LINE_HEIGHT = 18;
const SMALL_FONT_SIZE = 12;
const SMALL_LINE_HEIGHT = 16;

// Base text styles to avoid repetition
const baseText = {
    fontFamily: MONO_FONT,
    fontSize: FONT_SIZE,
    lineHeight: LINE_HEIGHT,
} as const;

const baseSmallText = {
    fontFamily: MONO_FONT,
    fontSize: SMALL_FONT_SIZE,
    lineHeight: SMALL_LINE_HEIGHT,
} as const;

export const sshStyles = StyleSheet.create((theme) => ({
    // Full-width terminal container — no padding, tight layout
    terminalContainer: {
        flexDirection: 'column',
        flexGrow: 1,
        flexBasis: 0,
    },
    // Single message row — tight vertical spacing like real terminal
    messageRow: {
        paddingHorizontal: 10,
        paddingVertical: 1,
    },
    // User command line: user@happy:~$ <input>
    commandLine: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'baseline',
        paddingTop: 2,
    },
    // user@hostname part (bold green)
    promptUser: {
        ...baseText,
        color: theme.colors.sshTerminal.prompt,
        fontWeight: '700',
    },
    // :~$ part (white/light)
    promptPath: {
        ...baseText,
        color: theme.colors.sshTerminal.userInput,
    },
    // User typed text
    userInputText: {
        ...baseText,
        color: theme.colors.sshTerminal.userInput,
        flexShrink: 1,
        flexGrow: 1,
    },
    // Agent output text — main body
    agentText: {
        ...baseText,
        color: theme.colors.sshTerminal.text,
    },
    // Thinking/dim text
    agentTextDim: {
        ...baseSmallText,
        color: theme.colors.sshTerminal.textDim,
        fontStyle: 'italic',
    },
    // Tool execution block — compact, no extra spacing
    toolContainer: {
        paddingHorizontal: 10,
        paddingVertical: 2,
    },
    toolHeader: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    toolPrefix: {
        ...baseSmallText,
        color: theme.colors.sshTerminal.toolName,
        fontWeight: '600',
    },
    toolName: {
        ...baseSmallText,
        color: theme.colors.sshTerminal.toolName,
    },
    toolInput: {
        ...baseText,
        color: theme.colors.sshTerminal.userInput,
    },
    toolResult: {
        ...baseSmallText,
        color: theme.colors.sshTerminal.text,
    },
    toolError: {
        ...baseSmallText,
        color: theme.colors.sshTerminal.error,
    },
    // Truncation indicator
    truncatedText: {
        ...baseSmallText,
        color: theme.colors.sshTerminal.systemEvent,
        fontStyle: 'italic',
    },
    // System event line — dim, compact
    systemLine: {
        flexDirection: 'row',
        alignItems: 'baseline',
        paddingHorizontal: 10,
        paddingVertical: 1,
    },
    systemPrefix: {
        ...baseSmallText,
        color: theme.colors.sshTerminal.systemPrefix,
        fontWeight: '700',
    },
    systemText: {
        ...baseSmallText,
        color: theme.colors.sshTerminal.systemEvent,
    },
    // Blinking cursor (for running state)
    cursor: {
        ...baseText,
        color: theme.colors.sshTerminal.cursor,
        fontWeight: '700',
    },
    // Children indentation for sub-agent messages
    childrenContainer: {
        paddingLeft: 10,
        borderLeftWidth: 1,
        borderLeftColor: theme.colors.sshTerminal.separator,
    },
}));
