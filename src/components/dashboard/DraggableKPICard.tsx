/**
 * ChurchAfrica ChMS - Draggable KPI Card
 * Drag-and-drop wrapper for KPI cards with visual feedback
 */

import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { KPICard, KPICardProps } from './KPICard';
import { cn } from '../ui/utils';
import { GripVertical } from 'lucide-react';

interface DraggableKPICardProps extends KPICardProps {
  id: string;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  isDraggingEnabled?: boolean;
}

interface DragItem {
  type: string;
  id: string;
  index: number;
}

const CARD_TYPE = 'KPI_CARD';

export function DraggableKPICard({
  id,
  index,
  moveCard,
  isDraggingEnabled = true,
  ...cardProps
}: DraggableKPICardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: CARD_TYPE,
    item: { type: CARD_TYPE, id, index },
    canDrag: isDraggingEnabled,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: CARD_TYPE,
    canDrop: () => isDraggingEnabled,
    hover: (item: DragItem, monitor) => {
      if (!ref.current || !isDraggingEnabled) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Get horizontal middle
      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      if (!clientOffset) {
        return;
      }

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Get pixels to the left
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  // Combine drag and drop refs
  if (isDraggingEnabled) {
    preview(drop(ref));
  }

  return (
    <div
      ref={ref}
      className={cn(
        'relative transition-all duration-200',
        isDragging && 'opacity-30',
        isOver && canDrop && 'scale-105',
        isDraggingEnabled && 'cursor-move'
      )}
    >
      {/* Drag Handle */}
      {isDraggingEnabled && (
        <div
          ref={drag}
          className={cn(
            'absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity',
            'cursor-grab active:cursor-grabbing',
            'bg-background/80 backdrop-blur-sm rounded p-1',
            'border border-border shadow-sm'
          )}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      )}

      {/* Drop Indicator */}
      {isOver && canDrop && (
        <div className="absolute inset-0 border-2 border-primary border-dashed rounded-lg pointer-events-none z-20" />
      )}

      {/* Actual KPI Card */}
      <div className={cn(isDraggingEnabled && 'group')}>
        <KPICard {...cardProps} />
      </div>
    </div>
  );
}

/**
 * Vue Migration Notes:
 * 
 * Use Vue Draggable Next or Sortable.js for drag-and-drop
 * 
 * // components/dashboard/DraggableKPICard.vue
 * <template>
 *   <div 
 *     class="draggable-card"
 *     :class="{ 
 *       'is-dragging': isDragging,
 *       'is-over': isOver 
 *     }"
 *   >
 *     <div v-if="isDraggingEnabled" class="drag-handle">
 *       <q-icon name="drag_indicator" />
 *     </div>
 *     <KPICard v-bind="cardProps" />
 *   </div>
 * </template>
 * 
 * <script setup lang="ts">
 * import { useSortable } from '@vueuse/integrations/useSortable';
 * import KPICard from './KPICard.vue';
 * 
 * interface Props extends KPICardProps {
 *   id: string;
 *   isDraggingEnabled?: boolean;
 * }
 * 
 * const props = withDefaults(defineProps<Props>(), {
 *   isDraggingEnabled: true,
 * });
 * </script>
 */
