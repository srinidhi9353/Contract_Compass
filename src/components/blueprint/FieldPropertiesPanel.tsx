import { BlueprintField } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface FieldPropertiesPanelProps {
  field: BlueprintField | null;
  onUpdateField: (fieldId: string, updates: Partial<BlueprintField>) => void;
  onRemoveField: (fieldId: string) => void;
}

export function FieldPropertiesPanel({
  field,
  onUpdateField,
  onRemoveField,
}: FieldPropertiesPanelProps) {
  if (!field) {
    return (
      <div className="bg-card rounded-xl border border-border p-4 shadow-card">
        <h3 className="font-semibold text-foreground mb-4">Field Properties</h3>
        <p className="text-sm text-muted-foreground">
          Select a field on the canvas to edit its properties
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-card">
      <h3 className="font-semibold text-foreground mb-4">Field Properties</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="field-label">Label</Label>
          <Input
            id="field-label"
            value={field.label}
            onChange={(e) => onUpdateField(field.id, { label: e.target.value })}
            placeholder="Enter field label"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="field-type">Type</Label>
          <Input
            id="field-type"
            value={field.type}
            disabled
            className="bg-muted"
          />
        </div>

        {(field.type === 'text' || field.type === 'date') && (
          <div className="space-y-2">
            <Label htmlFor="field-width">Width (px)</Label>
            <Input
              id="field-width"
              type="number"
              value={field.width || 180}
              onChange={(e) => onUpdateField(field.id, { width: parseInt(e.target.value) || 180 })}
              min={80}
              max={500}
            />
          </div>
        )}

        {field.type === 'signature' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="sig-width">Width (px)</Label>
              <Input
                id="sig-width"
                type="number"
                value={field.width || 200}
                onChange={(e) => onUpdateField(field.id, { width: parseInt(e.target.value) || 200 })}
                min={100}
                max={400}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sig-height">Height (px)</Label>
              <Input
                id="sig-height"
                type="number"
                value={field.height || 60}
                onChange={(e) => onUpdateField(field.id, { height: parseInt(e.target.value) || 60 })}
                min={40}
                max={150}
              />
            </div>
          </>
        )}

        <div className="flex items-center justify-between">
          <Label htmlFor="field-required">Required</Label>
          <Switch
            id="field-required"
            checked={field.required || false}
            onCheckedChange={(checked) => onUpdateField(field.id, { required: checked })}
          />
        </div>

        <div className="space-y-2">
          <Label>Position</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="pos-x" className="text-xs text-muted-foreground">X</Label>
              <Input
                id="pos-x"
                type="number"
                value={Math.round(field.position.x)}
                onChange={(e) => onUpdateField(field.id, { 
                  position: { ...field.position, x: parseInt(e.target.value) || 0 } 
                })}
                min={0}
                max={495}
              />
            </div>
            <div>
              <Label htmlFor="pos-y" className="text-xs text-muted-foreground">Y</Label>
              <Input
                id="pos-y"
                type="number"
                value={Math.round(field.position.y)}
                onChange={(e) => onUpdateField(field.id, { 
                  position: { ...field.position, y: parseInt(e.target.value) || 0 } 
                })}
                min={0}
                max={802}
              />
            </div>
          </div>
        </div>

        <Button
          variant="destructive"
          size="sm"
          className="w-full"
          onClick={() => onRemoveField(field.id)}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Field
        </Button>
      </div>
    </div>
  );
}
