
import { Prompt } from './ui/prompt';

interface RenamePromptProps {
    visible: boolean;
    defaultValue: string;
    onClose: () => void;
    onRename: (newName: string) => Promise<void>;
}

export function RenamePrompt({ visible, defaultValue, onClose, onRename }: RenamePromptProps) {
  return (
    <Prompt
      open={visible}
      onOpenChange={onClose}
      title="Rename Recording"
      message="Enter a new name for your recording:"
      onSubmit={onRename}
      defaultValue={defaultValue}
    />
  );
}
