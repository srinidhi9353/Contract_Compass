import { BlueprintField } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, CheckSquare, FileSignature, Type } from 'lucide-react';

interface ContractFormProps {
  fields: BlueprintField[];
  values: Record<string, any>;
  onChange: (fieldId: string, value: any) => void;
  readOnly?: boolean;
}

const fieldIcons: Record<string, React.ComponentType<any>> = {
  text: Type,
  date: Calendar,
  checkbox: CheckSquare,
  signature: FileSignature,
};

export function ContractForm({ fields, values, onChange, readOnly = false }: ContractFormProps) {
  // Sort fields by position (top to bottom, left to right)
  const sortedFields = [...fields].sort((a, b) => {
    if (Math.abs(a.position.y - b.position.y) < 30) {
      return a.position.x - b.position.x;
    }
    return a.position.y - b.position.y;
  });

  const renderField = (field: BlueprintField) => {
    const Icon = fieldIcons[field.type];
    const value = values[field.label] ?? '';

    switch (field.type) {
      case 'text':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-muted-foreground" />
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={field.id}
              value={value}
              onChange={(e) => onChange(field.label, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              disabled={readOnly}
            />
          </div>
        );

      case 'date':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-muted-foreground" />
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={field.id}
              type="date"
              value={value}
              onChange={(e) => onChange(field.label, e.target.value)}
              disabled={readOnly}
            />
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} className="flex items-center gap-3 py-2">
            <Checkbox
              id={field.id}
              checked={value || false}
              onCheckedChange={(checked) => onChange(field.label, checked)}
              disabled={readOnly}
            />
            <Label htmlFor={field.id} className="flex items-center gap-2 cursor-pointer">
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
          </div>
        );

      case 'signature':
        return (
          <div key={field.id} className="space-y-2">
            <Label className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-muted-foreground" />
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 min-h-[80px] flex items-center justify-center bg-muted/20">
              {value ? (
                <p className="text-lg italic text-foreground" style={{ fontFamily: 'cursive' }}>
                  {value}
                </p>
              ) : readOnly ? (
                <p className="text-sm text-muted-foreground">No signature</p>
              ) : (
                <Input
                  placeholder="Type your signature"
                  value={value}
                  onChange={(e) => onChange(field.label, e.target.value)}
                  className="border-0 bg-transparent text-center text-lg italic"
                  style={{ fontFamily: 'cursive' }}
                />
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {sortedFields.map(renderField)}
    </div>
  );
}
