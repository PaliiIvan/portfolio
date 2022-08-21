import gsap, { Bounce, } from 'gsap';
import { CustomEase } from '../3p/CustomEase';
import { Resources } from '../resource.loader';
import Vivus from "vivus";

gsap.registerPlugin(CustomEase);

export function showAnimationText(resources) {
    const greating = `Create magic by typing code`.split(' ');


    let sentence = greating.map(word => {
        let res = Array.from(word).map(ch => {
            return `<span class='ch'>${ch}</span>`;
        })

        return `<span class='word'>${res.join('')}&nbsp;</span>`;
    }).join(" ");


    const textContainer = document.querySelector('.hello_text')

    textContainer.innerHTML = sentence;

    gsap.from('.hello_text span',
        {
            duration: 1,
            y: -50,
            autoAlpha: 0,
            stagger: 0.1,
            ease: CustomEase.create("custom", "M0,0 C0,0 0.05,0.228 0.09,0.373 0.12,0.484 0.139,0.547 0.18,0.654 0.211,0.737 0.235,0.785 0.275,0.864 0.291,0.896 0.304,0.927 0.325,0.956 0.344,0.982 0.352,1.006 0.362,1.026 0.382,1.066 0.417,1.103 0.448,1.138 0.462,1.154 0.494,1.2 0.54,1.2 0.556,1.2 0.594,1.198 0.626,1.176 0.657,1.154 0.679,1.145 0.708,1.126 0.786,1.074 0.822,1.035 0.91,1.011 0.943,1.002 1,1 1,1 ")
        });




    const additionalText = document.querySelector('.description_text');
    const additionalTextAbout = document.querySelector('.description_text.about');
    const additionalTextContact = document.querySelector('.description_text.contact_me');


    additionalTextContact.innerHTML = `${resources[Resources.linkedIn]} <a href="mailto:palii.ivan.v@gmail.com">${resources[Resources.mail_icon]}</a>`;

    gsap.fromTo(additionalText, {
        x: 1000,

        opacity: 0
    }, {
        x: 0,
        duration: 1,
        opacity: 1
    });


    gsap.fromTo(additionalTextAbout, {
        x: '-200%',

        delay: 0.5,
        opacity: 0
    }, {
        duration: 1.5,
        x: '-50%',
        opacity: 1
    });

    const [linkedIn, mail] = additionalTextContact.querySelectorAll('svg');


    let res = new Vivus(linkedIn,
        {
            duration: 100,
            type: 'sync',

        });

    let res2 = new Vivus(mail,
        {
            duration: 100,
            type: 'sync',
        });


    const l = document.querySelector('#linked_in');

    l.addEventListener('click', () => {
        window.location.href = ('https://www.linkedin.com/in/ivan-palii-780629174/');
    })

    const m = document.querySelector('#mail');





}