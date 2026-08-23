import * as React from 'react'; declare module 'framer-motion' { export interface HTMLMotionProps<TagName extends keyof React.ReactHTML> { onDrag?: any; onDragStart?: any; onDragEnd?: any; } }
