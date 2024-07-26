declare module 'react-beautiful-dnd' {
    import * as React from 'react';
  
    export interface DragDropContextProps {
      onDragEnd: (result: DropResult) => void;
      onDragStart?: (initial: DragStart) => void;
      onDragUpdate?: (initial: DragUpdate) => void;
      children: React.ReactNode;
    }
  
    export class DragDropContext extends React.Component<DragDropContextProps> {}
  
    export interface DroppableProps {
      droppableId: string;
      type?: string;
      direction?: 'horizontal' | 'vertical';
      isDropDisabled?: boolean;
      isCombineEnabled?: boolean;
      ignoreContainerClipping?: boolean;
      renderClone?: DraggableChildrenFn;
      getContainerForClone?: () => HTMLElement;
      children: (provided: DroppableProvided, snapshot: DroppableStateSnapshot) => React.ReactNode;
    }
  
    export class Droppable extends React.Component<DroppableProps> {}
  
    export interface DraggableProps {
      draggableId: string;
      index: number;
      isDragDisabled?: boolean;
      disableInteractiveElementBlocking?: boolean;
      children: (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => React.ReactNode;
    }
  
    export class Draggable extends React.Component<DraggableProps> {}
  
    export interface DragStart {
      draggableId: string;
      type: string;
      source: DraggableLocation;
      mode: MovementMode;
    }
  
    export interface DragUpdate extends DragStart {
      destination?: DraggableLocation;
      combine?: Combine;
    }
  
    export interface DropResult extends DragUpdate {
      reason: DropReason;
    }
  
    export type MovementMode = 'FLUID' | 'SNAP';
  
    export interface DraggableLocation {
      droppableId: string;
      index: number;
    }
  
    export interface DraggableProvided {
      innerRef: (element?: HTMLElement | null) => any;
      draggableProps: any;
      dragHandleProps: any;
    }
  
    export interface DraggableStateSnapshot {
      isDragging: boolean;
      isDropAnimating: boolean;
      draggingOver: string | null;
      dropAnimation?: DropAnimation;
      mode: MovementMode;
      combineTargetFor: string | null;
      combineWith: string | null;
    }
  
    export interface DroppableProvided {
      innerRef: (element?: HTMLElement | null) => any;
      droppableProps: any;
      placeholder: React.ReactElement | null;
    }
  
    export interface DroppableStateSnapshot {
      isDraggingOver: boolean;
      draggingOverWith: string | null;
      isUsingPlaceholder: boolean;
    }
  
    export interface DropAnimation {
      duration: number;
      curve: string;
      moveTo: Position;
      opacity?: number;
      scale?: number;
    }
  
    export interface Position {
      x: number;
      y: number;
    }
  
    export interface Combine {
      draggableId: string;
      droppableId: string;
    }
  
    export type DropReason = 'DROP' | 'CANCEL';
  }
  