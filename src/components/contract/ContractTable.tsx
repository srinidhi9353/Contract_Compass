import { Contract } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Eye, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ContractTableProps {
  contracts: Contract[];
}

export function ContractTable({ contracts }: ContractTableProps) {
  const navigate = useNavigate();

  if (contracts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No contracts found</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card overflow-x-auto">
      {/* Desktop Table View */}
      <table className="hidden md:table w-full">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
              Contract Name
            </th>
            <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
              Blueprint
            </th>
            <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
              Status
            </th>
            <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
              Created
            </th>
            <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract, index) => (
            <motion.tr
              key={contract.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
            >
              <td className="py-4 px-6">
                <span className="font-medium text-foreground">{contract.name}</span>
              </td>
              <td className="py-4 px-6">
                <span className="text-muted-foreground">{contract.blueprintName}</span>
              </td>
              <td className="py-4 px-6">
                <StatusBadge status={contract.status} />
              </td>
              <td className="py-4 px-6">
                <span className="text-sm text-muted-foreground">
                  {format(new Date(contract.createdAt), 'MMM d, yyyy')}
                </span>
              </td>
              <td className="py-4 px-6 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/contracts/${contract.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/contracts/${contract.id}`)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/contracts/${contract.id}/edit`)}>
                        Edit Contract
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      
      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 p-4">
        {contracts.map((contract, index) => (
          <motion.div
            key={contract.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="border border-border rounded-lg p-4 hover:bg-muted/20 transition-colors"
            onClick={() => navigate(`/contracts/${contract.id}`)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-foreground">{contract.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{contract.blueprintName}</p>
              </div>
              <StatusBadge status={contract.status} />
            </div>
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-muted-foreground">
                {format(new Date(contract.createdAt), 'MMM d, yyyy')}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/contracts/${contract.id}`);
                }}
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
