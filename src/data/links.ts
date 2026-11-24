export interface SiteLink {
	href: string;
	label: string;
	description: string;
}

export const testLinks: SiteLink[] = [
	{ href: '/multi-touch-test/', label: 'Multi-Touch Test', description: 'See every finger your screen tracks at once.' },
	{ href: '/gesture-test/', label: 'Gesture Test', description: 'Tap, swipe, pinch, and rotate recognition.' },
	{ href: '/draw-test/', label: 'Draw Test', description: 'Finger-paint to spot gaps, jitter, and lag.' },
	{ href: '/tap-accuracy-test/', label: 'Tap Accuracy Test', description: 'Score how precisely your taps land.' },
	{ href: '/dead-zone-test/', label: 'Dead Zone Test', description: 'Find spots where the screen ignores touch.' },
	{ href: '/latency-test/', label: 'Latency Test', description: 'Time the delay between a prompt and your tap.' },
	{ href: '/scroll-test/', label: 'Scroll & Pan Test', description: 'Check touch scrolling smoothness and velocity.' },
];

export const deviceLinks: SiteLink[] = [
	{ href: '/iphone-touch-screen-test/', label: 'iPhone Touch Screen Test', description: 'Ghost touches, dead spots, and Haptic Touch on iPhone.' },
	{ href: '/ipad-touch-screen-test/', label: 'iPad Touch Screen Test', description: 'Large-screen coverage, multi-finger gestures, and Apple Pencil.' },
	{ href: '/android-touch-screen-test/', label: 'Android Touch Screen Test', description: 'Samsung Galaxy, Pixel, and every other Android phone or tablet.' },
	{ href: '/laptop-touch-screen-test/', label: 'Laptop Touch Screen Test', description: 'Windows touchscreen laptops, 2-in-1s, and Chromebooks.' },
];
