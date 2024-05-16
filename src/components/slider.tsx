import { useEffect, RefObject } from 'react';

interface slideProps {
    pagesRef: RefObject<HTMLDivElement>;
    paginationRef: RefObject<HTMLUListElement>;
}

const Slider = ({ pagesRef, paginationRef }: slideProps) => {
    useEffect(() => {
        if (!pagesRef.current || !paginationRef.current) return;

        const pages: HTMLDivElement = pagesRef.current;
        const pagination: HTMLUListElement = paginationRef.current;
        let slides: HTMLCollection,
            btns: HTMLLIElement[] = [],
            count: number = 0,
            current: number = 0,
            touchstart: number = 0,
            animation_state: boolean = false;


        const init = () => {
            slides = pages.children;
            count = slides.length;
            for (let i = 0; i < count; i++) {
                const slide: HTMLElement = slides[i] as HTMLElement;
                slide.style.bottom = `${-(i * 100)}%`;
                let btn: HTMLLIElement = document.createElement('li');
                btn.dataset.slide = String(i);
                btn.addEventListener('click', btnClick)
                btns.push(btn);
                pagination.appendChild(btn);
            }
            btns[0].classList.add('active');
        }

        const gotoNum = (index: number) => {
            if ((index !== current) && !animation_state) {
                animation_state = true;
                setTimeout(() => animation_state = false, 500);
                btns[current].classList.remove('active');
                current = index;
                btns[current].classList.add('active');
                for (let i = 0; i < count; i++) {
                    const slide: HTMLElement = slides[i] as HTMLElement;
                    slide.style.bottom = `${(current - i) * 100}%`;
                }
            }
        }

        const gotoNext = () => current < count - 1 ? gotoNum(current + 1) : false;
        const gotoPrev = () => current > 0 ? gotoNum(current - 1) : false;
        const btnClick = (e: MouseEvent) => gotoNum(parseInt((e.target as HTMLElement).dataset.slide || '0'));
        pages.ontouchstart = (e: TouchEvent) => touchstart = e.touches[0].screenY;
        pages.ontouchend = (e: TouchEvent) => touchstart < e.changedTouches[0].screenY ? gotoPrev() : gotoNext();
        pages.onwheel = (e: WheelEvent) => e.deltaY < 0 ? gotoPrev() : gotoNext();

        init();

    }, [pagesRef, paginationRef]);

    return null;
};

export default Slider;
