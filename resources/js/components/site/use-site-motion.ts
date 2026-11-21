import { useEffect } from 'react';

export function useSiteMotion(enabled: boolean) {
    useEffect(() => {
        if (!enabled || !('animate' in Element.prototype)) return;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const animations = new Set<Animation>();
        const animate = (element: Element, frames: Keyframe[], options: KeyframeAnimationOptions) => {
            const animation = element.animate(frames, options);
            animations.add(animation);
            void animation.finished.catch(() => undefined).finally(() => animations.delete(animation));

            return animation;
        };

        let observer: IntersectionObserver | undefined;

        if (!reducedMotion.matches && 'IntersectionObserver' in window) {
            const delays = new Map<Element, number>();
            document.querySelectorAll('.business-grid, .values-grid').forEach((group) => {
                Array.from(group.children).forEach((element, index) => delays.set(element, index * 85));
            });
            document.querySelectorAll('.hero-content > *').forEach((element, index) => delays.set(element, index * 90));

            observer = new IntersectionObserver(
                (entries, currentObserver) => {
                    entries.forEach(({ target, isIntersecting }) => {
                        if (!isIntersecting) return;
                        currentObserver.unobserve(target);
                        if (reducedMotion.matches || target.contains(document.activeElement)) return;

                        animate(
                            target,
                            [
                                { opacity: 0, transform: 'translateY(24px) scale(.985)' },
                                { opacity: 1, transform: 'translateY(0) scale(1)' },
                            ],
                            { duration: 720, delay: delays.get(target) ?? 0, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'backwards' },
                        );
                    });
                },
                { threshold: 0.08, rootMargin: '0px 0px -20px 0px' },
            );
            document
                .querySelectorAll(
                    '.hero-content > *, .section-heading, .business-card, .about-art, .about-copy, .value, .contact-copy, .location-card',
                )
                .forEach((element) => observer?.observe(element));
        }

        const rippleOnClick = (event: MouseEvent) => {
            if (reducedMotion.matches || !(event.target instanceof Element)) return;
            const control = event.target.closest('.button, .header-contact, .card-link, .floating-whatsapp, .menu-toggle');
            if (!control) return;

            control.querySelector('.press-ripple')?.remove();
            const { width, height, left, top } = control.getBoundingClientRect();
            const diameter = Math.max(width, height) * 2;
            const x = event.detail ? event.clientX - left : width / 2;
            const y = event.detail ? event.clientY - top : height / 2;
            const ripple = document.createElement('span');

            ripple.className = 'press-ripple';
            ripple.setAttribute('aria-hidden', 'true');
            Object.assign(ripple.style, {
                width: `${diameter}px`,
                height: `${diameter}px`,
                left: `${x - diameter / 2}px`,
                top: `${y - diameter / 2}px`,
            });
            control.append(ripple);
            const animation = animate(
                ripple,
                [
                    { transform: 'scale(0)', opacity: 0.18 },
                    { transform: 'scale(1)', opacity: 0 },
                ],
                { duration: 560, easing: 'cubic-bezier(.2, .7, .3, 1)' },
            );
            void animation.finished.catch(() => undefined).finally(() => ripple.remove());
        };

        const stopMotion = () => {
            observer?.disconnect();
            animations.forEach((animation) => animation.cancel());
        };
        const onMotionChange = () => {
            if (reducedMotion.matches) stopMotion();
        };

        document.addEventListener('click', rippleOnClick);
        reducedMotion.addEventListener('change', onMotionChange);

        return () => {
            stopMotion();
            document.removeEventListener('click', rippleOnClick);
            reducedMotion.removeEventListener('change', onMotionChange);
        };
    }, [enabled]);
}
