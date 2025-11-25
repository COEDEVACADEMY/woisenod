import { Button, Dialog, Input, Paragraph } from 'tamagui';
import { useState } from 'react';
import { View } from 'react-native';

type PromptProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    message: string;
    onSubmit: (value: string) => Promise<void> | void;
    defaultValue?: string;
    };

    export function Prompt({ open, onOpenChange, title, message, onSubmit, defaultValue = '' }: PromptProps) {
    const [value, setValue] = useState(defaultValue);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
        <Dialog.Overlay key="overlay" />
        <Dialog.Content>
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Description asChild>
            <Paragraph>{message}</Paragraph>
            </Dialog.Description>
            <Input value={value} onChangeText={setValue} placeholder="Enter a new name" />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16, gap: 8 }}>
            <Button onPress={() => onOpenChange(false)}>Cancel</Button>
            <Button
                onPress={async () => {
                await onSubmit(value);
                onOpenChange(false);
                }}
                theme="blue"
            >
                Save
            </Button>
            </View>
        </Dialog.Content>
        </Dialog>
    );
    }