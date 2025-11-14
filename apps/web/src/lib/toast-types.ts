export enum ToastType {
    SUCCESS = 'success',
    ERROR = 'error',
    WARNING = 'warning',
    INFO = 'info',
    LOADING = 'loading',
}

export enum ToastPosition {
    TOP_LEFT = 'top-left',
    TOP_RIGHT = 'top-right',
    TOP_CENTER = 'top-center',
    BOTTOM_LEFT = 'bottom-left',
    BOTTOM_RIGHT = 'bottom-right',
    BOTTOM_CENTER = 'bottom-center',
}

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    description?: string;
    duration?: number;
    position?: ToastPosition;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export interface ToastOptions {
    type: ToastType;
    title: string;
    description?: string;
    duration?: number;
    position?: ToastPosition;
    action?: {
        label: string;
        onClick: () => void;
    };
}
