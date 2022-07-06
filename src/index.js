import './styles/main.scss';
import './styles/navigation.scss';

import './scripts/scroll';
import "./scripts/about";




async function loadIcons() {
    const { default: yggdrasilIcon } = await import('./asset/icons/tree.m.svg');
    document.querySelector('.yggdrasil').innerHTML = yggdrasilIcon;
}

loadIcons();