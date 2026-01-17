import { Blueprint } from '@/types';
import { Button } from '@/components/ui/button';
import { FileText, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface BlueprintCardProps {
  blueprint: Blueprint;
  onDelete?: (id: string) => void;
  delay?: number;
}

export function BlueprintCard({ blueprint, onDelete, delay = 0 }: BlueprintCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-card rounded-xl border border-border p-6 shadow-card card-hover group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {blueprint.name}
            </h3>
            {blueprint.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {blueprint.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span>{blueprint.fields.length} fields</span>
              <span>•</span>
              <span>Created {format(new Date(blueprint.createdAt), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/blueprints/${blueprint.id}`)}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Blueprint
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/contracts/new?blueprintId=${blueprint.id}`)}>
              <FileText className="w-4 h-4 mr-2" />
              Create Contract
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete?.(blueprint.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-4 pt-4 border-t border-border flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => navigate(`/blueprints/${blueprint.id}`)}
        >
          <Pencil className="w-4 h-4 mr-1" />
          Edit
        </Button>
        <Button 
          size="sm" 
          className="flex-1"
          onClick={() => navigate(`/contracts/new?blueprintId=${blueprint.id}`)}
        >
          Use Template
        </Button>
      </div>
    </motion.div>
  );
}
