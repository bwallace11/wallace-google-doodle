const loadGsap = () => {
	const win = window as Window & { gsap?: any };
	if (win.gsap) {
		return Promise.resolve(win.gsap);
	}
	return new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.src = "https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js";
		script.onload = () => resolve(win.gsap);
		script.onerror = reject;
		document.head.appendChild(script);
	});
};

const runWindowScene = (gsap: any) => {
	const allDropIds: string[] = [];
	["L", "C", "R"].forEach((pane) => {
		const max = pane === "C" ? 31 : 14;
		for (let i = 0; i <= max; i += 1) {
			allDropIds.push(`r${pane}${i}`);
		}
	});

	allDropIds.forEach((id) => {
		const d = document.getElementById(id);
		if (!d) {
			return;
		}
		const ox1 = Number(d.getAttribute("x1"));
		const oy1 = Number(d.getAttribute("y1"));
		const ox2 = Number(d.getAttribute("x2"));
		const oy2 = Number(d.getAttribute("y2"));
		const dist = 220 + Math.random() * 110;
		const dur = 0.25 + Math.random() * 0.28;
		gsap.set(d, { opacity: 0 });
		gsap
			.timeline({ repeat: -1, delay: Math.random() * 2 })
			.set(d, { attr: { x1: ox1, y1: oy1, x2: ox2, y2: oy2 }, opacity: 0 })
			.to(d, {
				duration: dur,
				attr: {
					x1: ox1 - dist * 0.05,
					y1: oy1 + dist,
					x2: ox2 - dist * 0.05,
					y2: oy2 + dist,
				},
				opacity: 0.72,
				ease: "none",
			})
			.to(d, { duration: 0.05, opacity: 0 });
	});

	const flash = () => {
		const bolt = Math.random() > 0.5 ? "bolt1" : "bolt2";
		gsap
			.timeline()
			.to("#lglC", { opacity: 0.85, duration: 0.04 })
			.to(`#${bolt}`, { opacity: 1, duration: 0.04 }, "<")
			.to(`#${bolt}`, { opacity: 0, duration: 0.07 })
			.to(`#${bolt}`, { opacity: 0.55, duration: 0.03 })
			.to(`#${bolt}`, { opacity: 0, duration: 0.1 })
			.to("#lglC", { opacity: 0, duration: 0.5 }, "-=0.1");
		setTimeout(flash, 3000 + Math.random() * 5000);
	};

	const fogLoop = () => {
		const tl = gsap.timeline({
			onComplete: () => gsap.delayedCall(7, fogLoop),
		});
		tl.to("#fogBlob", { opacity: 0.88, duration: 2, ease: "power1.inOut" });
		tl.to("#txtReveal1", { attr: { width: 228 }, duration: 1.3, ease: "none" });
		tl.to("#txtReveal2", { attr: { width: 228 }, duration: 1.3, ease: "none" });
		tl.to({}, { duration: 3 });
		tl.to("#fogTxt", { opacity: 0, duration: 0.9, ease: "power1.in" });
		tl.to("#fogBlob", { opacity: 0, duration: 1.8, ease: "power1.inOut" }, "-=0.5");
		tl.set("#txtReveal1", { attr: { width: 0 } });
		tl.set("#txtReveal2", { attr: { width: 0 } });
		tl.set("#fogTxt", { opacity: 0.85 });
	};

	gsap.set("#curtainLeft", { x: -150, opacity: 0 });
	gsap.set("#curtainRight", { x: 150, opacity: 0 });
	gsap
		.timeline()
		.to("#curtainLeft", { x: 0, opacity: 1, duration: 1.9, ease: "power2.out" }, 0.3)
		.to("#curtainRight", { x: 0, opacity: 1, duration: 1.9, ease: "power2.out" }, 0.5)
		.call(() => setTimeout(flash, 900), [], 1.5)
		.call(fogLoop, [], 3.5);

	gsap.to("#curtainLeft", {
		skewX: 0.8,
		duration: 4.2,
		yoyo: true,
		repeat: -1,
		ease: "sine.inOut",
		delay: 2.5,
	});
	gsap.to("#curtainRight", {
		skewX: -0.8,
		duration: 4.5,
		yoyo: true,
		repeat: -1,
		ease: "sine.inOut",
		delay: 2.7,
	});
};

const ready = () => {
	const root = document.querySelector(".scene-svg");
	if (!root) {
		return;
	}

	loadGsap()
		.then((gsap) => {
			if (!gsap) {
				return;
			}

			const headParts = ["#Face-Group", "#Face-Scar"];
			const leftLegParts = [
				"#Left-Leg",
				"#Left-Top-Foot",
				"#Left-ShoeOutline",
				"#Left-ShoeTop",
				"#Left-ShoeStrap",
			];
			const rightLegParts = [
				"#Right-Leg",
				"#Right-Top-Foot",
				"#Right-ShoeOutline",
				"#Right-ShoeTop",
				"#Right-ShoeStrap",
				"#Chipped-Right-Leg-Piece",
				"#Leg-Crack",
			];
			const eyeParts = ["#Left-Eye", "#Blind-Eye"];

			const tiltHead = () => {
				gsap.to(headParts, {
					rotation: 2,
					svgOrigin: "400 260",
					duration: 0.7,
					ease: "sine.inOut",
					yoyo: true,
					repeat: 1,
					onComplete: () => {
						gsap.delayedCall(gsap.utils.random(2.5, 5.5), tiltHead);
					},
				});
			};
			tiltHead();

			gsap.to(leftLegParts, {
				rotation: 3,
				svgOrigin: "380 720",
				duration: 2.8,
				ease: "sine.inOut",
				yoyo: true,
				repeat: -1,
			});

			gsap.to(rightLegParts, {
				rotation: -3,
				svgOrigin: "440 720",
				duration: 2.8,
				ease: "sine.inOut",
				yoyo: true,
				repeat: -1,
				delay: 0.2,
			});

			gsap.set(eyeParts, { transformOrigin: "50% 50%" });
			const blink = () => {
				gsap.to(eyeParts, {
					scaleY: 0.05,
					duration: 0.08,
					yoyo: true,
					repeat: 1,
					ease: "power2.inOut",
					onComplete: () => {
						gsap.delayedCall(gsap.utils.random(2, 5), blink);
					},
				});
			};
			blink();

			runWindowScene(gsap);
		})
		.catch(() => {
			// GSAP failed to load; keep the scene static.
		});
};

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", ready, { once: true });
} else {
	ready();
}
