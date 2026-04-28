// Ambient declarations for vanilla JS scripts shipped from @haven/design-system.
// These are side-effect-only imports (IIFEs that wire DOM behavior); type
// safety comes from the call site, not the module surface. Promote to typed
// React ports when a script's behavior needs React-controlled state.

declare module '@haven/design-system/scripts/*';
