import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { BlueprintCanvas } from '@/components/blueprint/BlueprintCanvas';
import { FieldToolbox } from '@/components/blueprint/FieldToolbox';
import { FieldPropertiesPanel } from '@/components/blueprint/FieldPropertiesPanel';
import { useBlueprintStore } from '@/store/blueprintStore';
import { BlueprintField, FieldType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { v4 as uuidv4 } from 'uuid';

export default function BlueprintEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const getBlueprint = useBlueprintStore((state) => state.getBlueprint);
  const addBlueprint = useBlueprintStore((state) => state.addBlueprint);
  const updateBlueprint = useBlueprintStore((state) => state.updateBlueprint);
  const addField = useBlueprintStore((state) => state.addField);
  const updateField = useBlueprintStore((state) => state.updateField);
  const removeField = useBlueprintStore((state) => state.removeField);

  const existingBlueprint = !isNew ? getBlueprint(id!) : undefined;

  const [name, setName] = useState(existingBlueprint?.name || '');
  const [description, setDescription] = useState(existingBlueprint?.description || '');
  const [localFields, setLocalFields] = useState<BlueprintField[]>(
    existingBlueprint?.fields || []
  );
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [blueprintId, setBlueprintId] = useState(existingBlueprint?.id || '');

  const selectedField = localFields.find((f) => f.id === selectedFieldId) || null;

  const handleAddField = (type: FieldType) => {
    const newField: BlueprintField = {
      id: uuidv4(),
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      position: { x: 50, y: 80 + localFields.length * 60 },
      required: false,
      width: type === 'checkbox' ? undefined : type === 'signature' ? 200 : 180,
      height: type === 'signature' ? 60 : undefined,
    };
    setLocalFields((prev) => [...prev, newField]);
    setSelectedFieldId(newField.id);
  };

  const handleUpdateField = (fieldId: string, updates: Partial<BlueprintField>) => {
    setLocalFields((prev) =>
      prev.map((f) => (f.id === fieldId ? { ...f, ...updates } : f))
    );
  };

  const handleRemoveField = (fieldId: string) => {
    setLocalFields((prev) => prev.filter((f) => f.id !== fieldId));
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Please enter a blueprint name');
      return;
    }

    if (isNew) {
      const newBlueprint = addBlueprint(name, description);
      setBlueprintId(newBlueprint.id);
      // Add all local fields to the new blueprint
      localFields.forEach((field) => {
        addField(newBlueprint.id, {
          type: field.type,
          label: field.label,
          position: field.position,
          required: field.required,
          width: field.width,
          height: field.height,
        });
      });
      toast.success('Blueprint created successfully');
      navigate(`/blueprints/${newBlueprint.id}`);
    } else {
      updateBlueprint(id!, { name, description, fields: localFields });
      toast.success('Blueprint saved successfully');
    }
  };

  if (!isNew && !existingBlueprint) {
    return (
      <MainLayout title="Blueprint Not Found">
        <div className="text-center py-12">
          <p className="text-muted-foreground">The blueprint you're looking for doesn't exist.</p>
          <Button className="mt-4" onClick={() => navigate('/blueprints')}>
            Back to Blueprints
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title={isNew ? 'Create Blueprint' : `Edit: ${existingBlueprint?.name}`}
      subtitle={isNew ? 'Design your contract template' : 'Modify your template fields and layout'}
    >
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/blueprints')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blueprints
        </Button>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          {isNew ? 'Create Blueprint' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Toolbox */}
        <div className="lg:col-span-1 space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card rounded-xl border border-border p-4 shadow-card"
          >
            <h3 className="font-semibold text-foreground mb-4">Blueprint Info</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bp-name">Name *</Label>
                <Input
                  id="bp-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Service Agreement"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bp-desc">Description</Label>
                <Textarea
                  id="bp-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this template"
                  rows={3}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <FieldToolbox onAddField={handleAddField} />
          </motion.div>
        </div>

        {/* Center - Canvas */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <BlueprintCanvas
              fields={localFields}
              onUpdateField={handleUpdateField}
              onRemoveField={handleRemoveField}
              selectedFieldId={selectedFieldId}
              onSelectField={setSelectedFieldId}
            />
          </motion.div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <FieldPropertiesPanel
              field={selectedField}
              onUpdateField={handleUpdateField}
              onRemoveField={handleRemoveField}
            />
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
