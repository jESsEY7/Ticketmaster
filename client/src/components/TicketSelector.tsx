import { Plus, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TicketSelectorProps {
  ticket: {
    id: number;
    name: string;
    description: string;
    price: number;
    availableQuantity: number;
    maxPerOrder: number;
  };
  selectedQuantity: number;
  onChange: (quantity: number) => void;
}

export default function TicketSelector({
  ticket,
  selectedQuantity,
  onChange,
}: TicketSelectorProps) {
  const isSelected = selectedQuantity > 0;
  const isLowStock = ticket.availableQuantity <= 30;

  const handleDecrease = () => {
    if (selectedQuantity > 0) {
      onChange(selectedQuantity - 1);
    }
  };

  const handleIncrease = () => {
    if (selectedQuantity < Math.min(ticket.availableQuantity, ticket.maxPerOrder)) {
      onChange(selectedQuantity + 1);
    }
  };

  return (
    <div
      className={cn(
        "border rounded-lg p-4 bg-white hover:border-primary transition-colors duration-200",
        isSelected ? "border-primary shadow-sm" : "border-gray-200"
      )}
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium text-gray-900">{ticket.name}</h4>
        <span className="font-semibold text-primary">${ticket.price.toFixed(2)}</span>
      </div>
      <p className="text-sm text-gray-600 mb-1">{ticket.description}</p>
      
      {isLowStock && (
        <p className="text-xs text-secondary mb-3">
          <span className="inline-flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"></path>
            </svg>
            Only {ticket.availableQuantity} tickets left
          </span>
        </p>
      )}
      
      <div className="flex items-center justify-end">
        <button
          onClick={handleDecrease}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center focus:outline-none",
            selectedQuantity > 0
              ? "bg-primary text-white hover:bg-blue-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          )}
          disabled={selectedQuantity === 0}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="mx-3 w-6 text-center">{selectedQuantity}</span>
        <button
          onClick={handleIncrease}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center focus:outline-none",
            selectedQuantity < Math.min(ticket.availableQuantity, ticket.maxPerOrder)
              ? "bg-primary text-white hover:bg-blue-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          )}
          disabled={selectedQuantity >= Math.min(ticket.availableQuantity, ticket.maxPerOrder)}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
