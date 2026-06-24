"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: {
    name: string;
    target: number;
    current: number;
  }) => Promise<void>;
  editingGoal?: {
    id?: string;
    name: string;
    target: number;
    current: number;
  } | null;
}

export default function GoalModal({
  isOpen,
  onClose,
  onSave,
  editingGoal,
}: GoalModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [goal, setGoal] = useState({
    name: "",
    target: "",
    current: "",
  });

  useEffect(() => {
    if (editingGoal) {
      setGoal({
        name: editingGoal.name,
        target: editingGoal.target.toString(),
        current: editingGoal.current.toString(),
      });
    } else {
      setGoal({
        name: "",
        target: "",
        current: "",
      });
    }
    setError(null);
  }, [editingGoal, isOpen]);

  const validate = (): string | null => {
    if (!goal.name.trim()) {
      return "Please enter a goal name.";
    }

    const target = Number(goal.target);
    const current = Number(goal.current);

    if (!goal.target || isNaN(target) || target <= 0) {
      return "Target amount must be a positive number.";
    }

    if (goal.current === "" || isNaN(current) || current < 0) {
      return "Current amount must be a valid number.";
    }

    if (current > target) {
      return "Current amount cannot exceed the target amount.";
    }

    return null;
  };

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await onSave({
        name: goal.name,
        target: Number(goal.target),
        current: Number(goal.current),
      });

      onClose();
    } catch (error) {
      console.error(error);
      setError("Something went wrong while saving. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[var(--color-surface)] rounded-3xl shadow-xl w-full max-w-md p-6 border border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[var(--color-ink)]">
            {editingGoal
              ? "Update Financial Goal"
              : "Create Financial Goal"}
          </h2>

          <button
            onClick={onClose}
            className="text-[var(--color-muted)] hover:text-[var(--color-ink)]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Goal Name
            </label>

            <input
              type="text"
              value={goal.name}
              onChange={(e) =>
                setGoal({
                  ...goal,
                  name: e.target.value,
                })
              }
              placeholder="Emergency Fund"
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Target Amount
            </label>

            <input
              type="number"
              value={goal.target}
              onChange={(e) =>
                setGoal({
                  ...goal,
                  target: e.target.value,
                })
              }
              placeholder="100000"
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Current Amount
            </label>

            <input
              type="number"
              value={goal.current}
              onChange={(e) =>
                setGoal({
                  ...goal,
                  current: e.target.value,
                })
              }
              placeholder="10000"
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
            />
          </div>

          {error && (
            <p className="text-sm text-[var(--color-expense)]">{error}</p>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>

    <Button disabled={loading} className="flex-1" onClick={handleSave}>
            {loading
              ? "Saving..."
              : editingGoal
              ? "Update Goal"
              : "Save Goal"}
          </Button>
        </div>
      </div>
    </div>
  );
}