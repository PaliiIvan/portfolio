import gsap, { Bounce, } from 'gsap';
import { CustomEase } from '../3p/CustomEase';

gsap.registerPlugin(CustomEase);

export function showAnimationText() {
    const greating = `Create magic by typing code`.split(' ');

    console.log(greating);
    let sentence = greating.map(word => {
        let res = Array.from(word).map(ch => {
            return `<span class='ch'>${ch}</span>`;
        })

        return `<span class='word'>${res.join('')}&nbsp;</span>`;
    }).join(" ");


    const textContainer = document.querySelector('.hello_text')

    textContainer.innerHTML = sentence;
    console.log(CustomEase);
    gsap.from('.hello_text span', { duration: 1, y: -50, autoAlpha: 0, stagger: 0.1, ease: CustomEase.create("custom", "M0,0 C0,0 0.05,0.228 0.09,0.373 0.12,0.484 0.139,0.547 0.18,0.654 0.211,0.737 0.235,0.785 0.275,0.864 0.291,0.896 0.304,0.927 0.325,0.956 0.344,0.982 0.352,1.006 0.362,1.026 0.382,1.066 0.417,1.103 0.448,1.138 0.462,1.154 0.494,1.2 0.54,1.2 0.556,1.2 0.594,1.198 0.626,1.176 0.657,1.154 0.679,1.145 0.708,1.126 0.786,1.074 0.822,1.035 0.91,1.011 0.943,1.002 1,1 1,1 ") });




    const additionalText = document.querySelector('.description_text');

    additionalText.innerHTML = ` Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
    industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
    scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into
    electronic typesetting, remaining essentially unchanged.`;

    gsap.from(additionalText, {
        x: 1000,
        duration: 1
    })








}