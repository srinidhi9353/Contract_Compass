import { useState, useRef } from 'react';
import { BlueprintField } from '@/types';
import { cn } from '@/lib/utils';
import { Type, Calendar, CheckSquare, FileSignature, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlueprintCanvasProps {
  fields: BlueprintField[];
  onUpdateField: (fieldId: string, updates: Partial<BlueprintField>) => void;
  onRemoveField: (fieldId: string) => void;
  selectedFieldId: string | null;
  onSelectField: (fieldId: string | null) => void;
}

const fieldIcons: Record<string, React.ComponentType<any>> = {
  text: Type,
  date: Calendar,
  checkbox: CheckSquare,
  signature: FileSignature,
};

export function BlueprintCanvas({
  fields,
  onUpdateField,
  onRemoveField,
  selectedFieldId,
  onSelectField,
}: BlueprintCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent, field: BlueprintField) => {
    e.preventDefault();
    onSelectField(field.id);
    
    const rect = (e.target as HTMLElement).closest('.field-draggable')?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    setDraggingId(field.id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - canvasRect.left - dragOffset.x;
    const newY = e.clientY - canvasRect.top - dragOffset.y;

    // Constrain to canvas bounds
    const constrainedX = Math.max(0, Math.min(newX, 595 - 100));
    const constrainedY = Math.max(0, Math.min(newY, 842 - 40));

    onUpdateField(draggingId, {
      position: { x: constrainedX, y: constrainedY },
    });
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  return (
    <div className="relative overflow-auto bg-muted/50 rounded-xl p-8 flex justify-center">
      <div
        ref={canvasRef}
        className="canvas-page relative"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={() => onSelectField(null)}
      >
        {/* Page header guide */}
        <div className="absolute top-0 left-0 right-0 h-16 border-b border-dashed border-border/50 flex items-center justify-center text-xs text-muted-foreground">
          Header Area
        </div>

        {/* Page footer guide */}
        <div className="absolute bottom-0 left-0 right-0 h-16 border-t border-dashed border-border/50 flex items-center justify-center text-xs text-muted-foreground">
          Footer Area
        </div>

        {/* Fields */}
        {fields.map((field) => {
          const Icon = fieldIcons[field.type];
          const isSelected = selectedFieldId === field.id;
          const isDragging = draggingId === field.id;

          return (
            <div
              key={field.id}
              className={cn(
                'field-draggable group border-2 rounded-md p-2 bg-background',
                isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border',
                isDragging && 'shadow-lg z-10'
              )}
              style={{
                left: field.position.x,
                top: field.position.y,
                width: field.width || (field.type === 'checkbox' ? 'auto' : 180),
                minHeight: field.height || (field.type === 'signature' ? 60 : 'auto'),
              }}
              onMouseDown={(e) => handleMouseDown(e, field)}
              onClick={(e) => {
                e.stopPropagation();
                onSelectField(field.id);
              }}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-xs font-medium text-foreground truncate">
                  {field.label}
                </span>
                {field.required && (
                  <span className="text-xs text-destructive">*</span>
                )}
              </div>

              {field.type === 'signature' && (
                <div className="mt-2 border-t border-dashed border-muted-foreground/30 pt-1">
                  <span className="text-[10px] text-muted-foreground">Sign here</span>
                </div>
              )}

              {/* Delete button */}
              {isSelected && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-3 -right-3 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveField(field.id);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          );
        })}

        {/* Empty state */}
        {fields.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">Drag fields here or click to add</p>
              <p className="text-xs text-muted-foreground mt-1">
                Position fields by dragging them around the canvas
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
