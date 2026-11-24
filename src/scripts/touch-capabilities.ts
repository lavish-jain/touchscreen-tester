export interface TouchCapabilities {
	supportsTouch: boolean;
	maxTouchPoints: number;
	hasCoarsePointer: boolean;
	hasFinePointer: boolean;
	hasHover: boolean;
}

export function detectTouchCapabilities(): TouchCapabilities {
	const supportsTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
	return {
		supportsTouch,
		maxTouchPoints: navigator.maxTouchPoints ?? 0,
		hasCoarsePointer: window.matchMedia('(pointer: coarse)').matches,
		hasFinePointer: window.matchMedia('(pointer: fine)').matches,
		hasHover: window.matchMedia('(hover: hover)').matches,
	};
}
