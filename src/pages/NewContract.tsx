import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ContractForm } from '@/components/contract/ContractForm';
import { useBlueprintStore } from '@/store/blueprintStore';
import { useContractStore } from '@/store/contractStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, FileText, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function NewContractPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedBlueprintId = searchParams.get('blueprintId');
  
  const blueprints = useBlueprintStore((state) => state.blueprints);
  const addContract = useContractStore((state) => state.addContract);

  const [selectedBlueprintId, setSelectedBlueprintId] = useState(preselectedBlueprintId || '');
  const [contractName, setContractName] = useState('');
  const [values, setValues] = useState<Record<string, any>>({});

  const selectedBlueprint = blueprints.find((bp) => bp.id === selectedBlueprintId);

  const handleFieldChange = (fieldLabel: string, value: any) => {
    setValues((prev) => ({ ...prev, [fieldLabel]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBlueprint) {
      toast.error('Please select a template');
      return;
    }

    if (!contractName.trim()) {
      toast.error('Please enter a contract name');
      return;
    }

    // Validate required fields
    const missingRequired = selectedBlueprint.fields
      .filter((f) => f.required)
      .filter((f) => !values[f.label] && values[f.label] !== false);

    if (missingRequired.length > 0) {
      toast.error(`Please fill in required fields: ${missingRequired.map(f => f.label).join(', ')}`);
      return;
    }

    const contract = addContract(
      contractName,
      selectedBlueprint.id,
      selectedBlueprint.name,
      values
    );

    toast.success('Contract created successfully');
    navigate(`/contracts/${contract.id}`);
  };

  return (
    <MainLayout title="Create Contract" subtitle="Fill in the details to create a new contract">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6"
        onClick={() => navigate('/contracts')}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Contracts
      </Button>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border p-6 shadow-card"
            >
              <h2 className="font-semibold text-foreground mb-6">Contract Information</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="blueprint">Select Template *</Label>
                  <Select value={selectedBlueprintId} onValueChange={setSelectedBlueprintId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a blueprint template" />
                    </SelectTrigger>
                    <SelectContent>
                      {blueprints.map((bp) => (
                        <SelectItem key={bp.id} value={bp.id}>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            {bp.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Contract Name *</Label>
                  <Input
                    id="name"
                    value={contractName}
                    onChange={(e) => setContractName(e.target.value)}
                    placeholder="e.g., Service Agreement - Acme Corp"
                  />
                </div>
              </div>
            </motion.div>

            {selectedBlueprint && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-xl border border-border p-6 shadow-card"
              >
                <h2 className="font-semibold text-foreground mb-6">Contract Fields</h2>
                <ContractForm
                  fields={selectedBlueprint.fields}
                  values={values}
                  onChange={handleFieldChange}
                />
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl border border-border p-6 shadow-card sticky top-24"
            >
              <h2 className="font-semibold text-foreground mb-4">Summary</h2>
              
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Template</span>
                  <span className="text-foreground">
                    {selectedBlueprint?.name || 'Not selected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fields</span>
                  <span className="text-foreground">
                    {selectedBlueprint?.fields.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Initial Status</span>
                  <span className="text-foreground">Created</span>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={!selectedBlueprint}>
                <Save className="w-4 h-4 mr-2" />
                Create Contract
              </Button>
            </motion.div>
          </div>
        </div>
      </form>
    </MainLayout>
  );
}
