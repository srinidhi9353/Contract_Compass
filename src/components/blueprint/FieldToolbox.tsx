import { FieldType } from '@/types';
import { cn } from '@/lib/utils';
import { Calendar, CheckSquare, FileSignature, Type } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';

interface FieldToolboxProps {
  onAddField: (type: FieldType) => void;
}

const fieldTypes: { type: FieldType; label: string; icon: React.ComponentType<any> }[] = [
  { type: 'text', label: 'Text Field', icon: Type },
  { type: 'date', label: 'Date Picker', icon: Calendar },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare },
  { type: 'signature', label: 'Signature', icon: FileSignature },
];

function DraggableField({ type, label, icon: Icon, onAddField }: { 
  type: FieldType; 
  label: string; 
  icon: React.ComponentType<any>;
  onAddField: (type: FieldType) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `toolbox-${type}`,
    data: { type, isNew: true },
  });

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => onAddField(type)}
      className={cn(
        'flex items-center gap-3 w-full p-3 rounded-lg border border-border bg-background hover:bg-muted transition-colors text-left',
        isDragging && 'opacity-50'
      )}
    >
      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </button>
  );
}

export function FieldToolbox({ onAddField }: FieldToolboxProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-card">
      <h3 className="font-semibold text-foreground mb-4">Field Types</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Click or drag fields to add them to the canvas
      </p>
      <div className="space-y-2">
        {fieldTypes.map((field) => (
          <DraggableField
            key={field.type}
            {...field}
            onAddField={onAddField}
          />
        ))}
      </div>
    </div>
  );
}
