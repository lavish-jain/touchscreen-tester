export type GestureType =
	| 'tap'
	| 'doubletap'
	| 'longpress'
	| 'swipe-up'
	| 'swipe-down'
	| 'swipe-left'
	| 'swipe-right'
	| 'pinch-in'
	| 'pinch-out'
	| 'rotate';

export interface GestureEventDetail {
	type: GestureType;
	timestamp: number;
	x: number;
	y: number;
}

export const GESTURE_EVENT = 'gesture';

interface Point {
	x: number;
	y: number;
}

const TAP_MAX_DURATION_MS = 250;
const TAP_MAX_MOVEMENT_PX = 10;
const DOUBLE_TAP_WINDOW_MS = 300;
const DOUBLE_TAP_MAX_DISTANCE_PX = 30;
const LONG_PRESS_DURATION_MS = 500;
const SWIPE_MIN_DISTANCE_PX = 40;
const SWIPE_MAX_DURATION_MS = 600;
const PINCH_THRESHOLD_PX = 12;
const ROTATE_THRESHOLD_DEG = 8;

function distance(a: Point, b: Point): number {
	return Math.hypot(a.x - b.x, a.y - b.y);
}

function angleDeg(a: Point, b: Point): number {
	return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
}

function normalizeAngleDelta(delta: number): number {
	return ((delta + 180) % 360 + 360) % 360 - 180;
}

function swipeDirection(dx: number, dy: number): 'up' | 'down' | 'left' | 'right' {
	return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up';
}

/** Attaches to an element and emits a `gesture` CustomEvent<GestureEventDetail> (bubbling) for recognized touch gestures. */
export class GestureDetector {
	private readonly el: HTMLElement;
	private readonly activeTouches = new Map<number, Point>();
	private readonly startTouches = new Map<number, Point>();
	private singleStart: (Point & { time: number }) | null = null;
	private longPressTimer: number | null = null;
	private lastTapTime = 0;
	private lastTapPos: Point | null = null;
	private initialDistance = 0;
	private initialAngle = 0;
	private pinchFired = false;
	private rotateFired = false;
	private moved = false;

	constructor(el: HTMLElement) {
		this.el = el;
		el.addEventListener('touchstart', this.onTouchStart, { passive: true });
		el.addEventListener('touchmove', this.onTouchMove, { passive: true });
		el.addEventListener('touchend', this.onTouchEnd, { passive: true });
		el.addEventListener('touchcancel', this.onTouchCancel, { passive: true });
	}

	destroy(): void {
		this.el.removeEventListener('touchstart', this.onTouchStart);
		this.el.removeEventListener('touchmove', this.onTouchMove);
		this.el.removeEventListener('touchend', this.onTouchEnd);
		this.el.removeEventListener('touchcancel', this.onTouchCancel);
		this.clearLongPress();
	}

	private emit(type: GestureType, x: number, y: number): void {
		const detail: GestureEventDetail = { type, timestamp: Date.now(), x, y };
		this.el.dispatchEvent(new CustomEvent<GestureEventDetail>(GESTURE_EVENT, { detail, bubbles: true }));
	}

	private clearLongPress(): void {
		if (this.longPressTimer !== null) {
			window.clearTimeout(this.longPressTimer);
			this.longPressTimer = null;
		}
	}

	private onTouchStart = (e: TouchEvent): void => {
		for (const t of Array.from(e.changedTouches)) {
			const pt = { x: t.clientX, y: t.clientY };
			this.activeTouches.set(t.identifier, pt);
			this.startTouches.set(t.identifier, pt);
		}
		this.moved = false;
		this.clearLongPress();

		if (this.activeTouches.size === 1) {
			const [[, pt]] = this.activeTouches;
			this.singleStart = { ...pt, time: Date.now() };
			this.longPressTimer = window.setTimeout(() => {
				if (this.activeTouches.size === 1 && !this.moved) {
					this.emit('longpress', pt.x, pt.y);
					this.singleStart = null;
				}
			}, LONG_PRESS_DURATION_MS);
		} else {
			this.singleStart = null;
		}

		if (this.activeTouches.size === 2) {
			const [a, b] = Array.from(this.activeTouches.values());
			this.initialDistance = distance(a, b);
			this.initialAngle = angleDeg(a, b);
			this.pinchFired = false;
			this.rotateFired = false;
		}
	};

	private onTouchMove = (e: TouchEvent): void => {
		for (const t of Array.from(e.changedTouches)) {
			this.activeTouches.set(t.identifier, { x: t.clientX, y: t.clientY });
		}

		if (this.singleStart) {
			const current = Array.from(this.activeTouches.values())[0];
			if (current && distance(this.singleStart, current) > TAP_MAX_MOVEMENT_PX) {
				this.moved = true;
				this.clearLongPress();
			}
		}

		if (this.activeTouches.size === 2) {
			const [a, b] = Array.from(this.activeTouches.values());
			const midpoint = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
			const dist = distance(a, b);
			const ang = angleDeg(a, b);

			if (!this.pinchFired) {
				const delta = dist - this.initialDistance;
				if (Math.abs(delta) > PINCH_THRESHOLD_PX) {
					this.emit(delta > 0 ? 'pinch-out' : 'pinch-in', midpoint.x, midpoint.y);
					this.pinchFired = true;
				}
			}

			if (!this.rotateFired) {
				const deltaAngle = normalizeAngleDelta(ang - this.initialAngle);
				if (Math.abs(deltaAngle) > ROTATE_THRESHOLD_DEG) {
					this.emit('rotate', midpoint.x, midpoint.y);
					this.rotateFired = true;
				}
			}
		}
	};

	private onTouchEnd = (e: TouchEvent): void => {
		for (const t of Array.from(e.changedTouches)) {
			const startPt = this.startTouches.get(t.identifier);
			this.activeTouches.delete(t.identifier);
			this.startTouches.delete(t.identifier);

			if (this.activeTouches.size === 0 && this.singleStart && startPt) {
				this.clearLongPress();
				const dx = t.clientX - this.singleStart.x;
				const dy = t.clientY - this.singleStart.y;
				const dist = Math.hypot(dx, dy);
				const duration = Date.now() - this.singleStart.time;

				if (dist > SWIPE_MIN_DISTANCE_PX && duration < SWIPE_MAX_DURATION_MS) {
					this.emit(`swipe-${swipeDirection(dx, dy)}`, t.clientX, t.clientY);
				} else if (dist < TAP_MAX_MOVEMENT_PX && duration < TAP_MAX_DURATION_MS) {
					const now = Date.now();
					const pos = { x: t.clientX, y: t.clientY };
					if (
						this.lastTapPos &&
						now - this.lastTapTime < DOUBLE_TAP_WINDOW_MS &&
						distance(this.lastTapPos, pos) < DOUBLE_TAP_MAX_DISTANCE_PX
					) {
						this.emit('doubletap', pos.x, pos.y);
						this.lastTapTime = 0;
						this.lastTapPos = null;
					} else {
						this.emit('tap', pos.x, pos.y);
						this.lastTapTime = now;
						this.lastTapPos = pos;
					}
				}
				this.singleStart = null;
			}
		}
	};

	private onTouchCancel = (e: TouchEvent): void => {
		for (const t of Array.from(e.changedTouches)) {
			this.activeTouches.delete(t.identifier);
			this.startTouches.delete(t.identifier);
		}
		this.clearLongPress();
		this.singleStart = null;
	};
}
