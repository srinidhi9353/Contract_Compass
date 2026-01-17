import { MainLayout } from '@/components/layout/MainLayout';
import { BlueprintCard } from '@/components/blueprint/BlueprintCard';
import { useBlueprintStore } from '@/store/blueprintStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function BlueprintsPage() {
  const navigate = useNavigate();
  const blueprints = useBlueprintStore((state) => state.blueprints);
  const deleteBlueprint = useBlueprintStore((state) => state.deleteBlueprint);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredBlueprints = blueprints.filter((bp) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      bp.name.toLowerCase().includes(query) ||
      bp.description?.toLowerCase().includes(query)
    );
  });

  const handleDelete = (id: string) => {
    deleteBlueprint(id);
    setDeleteId(null);
    toast.success('Blueprint deleted successfully');
  };

  return (
    <MainLayout title="Blueprints" subtitle="Manage your contract templates">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search blueprints..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => navigate('/blueprints/new')}>
          <Plus className="w-4 h-4 mr-2" />
          New Blueprint
        </Button>
      </div>

      {/* Blueprint Grid */}
      {filteredBlueprints.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlueprints.map((blueprint, index) => (
            <BlueprintCard
              key={blueprint.id}
              blueprint={blueprint}
              onDelete={(id) => setDeleteId(id)}
              delay={index * 0.1}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <p className="text-muted-foreground">
            {searchQuery ? 'No blueprints match your search' : 'No blueprints yet'}
          </p>
          {!searchQuery && (
            <Button className="mt-4" onClick={() => navigate('/blueprints/new')}>
              Create Your First Blueprint
            </Button>
          )}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blueprint</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this blueprint? This action cannot be undone.
              Existing contracts using this blueprint will not be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
