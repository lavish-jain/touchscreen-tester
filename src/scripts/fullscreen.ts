interface FullscreenDocument extends Document {
	webkitFullscreenElement?: Element | null;
	webkitExitFullscreen?: () => Promise<void> | void;
}

interface FullscreenElement extends HTMLElement {
	webkitRequestFullscreen?: () => Promise<void> | void;
}

export function isFullscreenSupported(): boolean {
	const el = document.documentElement as FullscreenElement;
	return typeof el.requestFullscreen === 'function' || typeof el.webkitRequestFullscreen === 'function';
}

export function isFullscreen(): boolean {
	const doc = document as FullscreenDocument;
	return Boolean(doc.fullscreenElement || doc.webkitFullscreenElement);
}

export async function toggleFullscreen(el: HTMLElement): Promise<void> {
	const doc = document as FullscreenDocument;
	const target = el as FullscreenElement;

	if (isFullscreen()) {
		if (doc.exitFullscreen) await doc.exitFullscreen();
		else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
	} else if (target.requestFullscreen) {
		await target.requestFullscreen();
	} else if (target.webkitRequestFullscreen) {
		await target.webkitRequestFullscreen();
	}
}
