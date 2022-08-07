export const Resources = {
    yggdrasil: 'yggdrasil',
    anvil_page_icon: 'anvil_page_icon',
    sword_border: 'sword_border',
    about_icon: 'about_icon'
}

const resourcesList = [
    { name: Resources.yggdrasil, loader: () => import('../asset/icons/tree_ordered.m.svg') },
    { name: Resources.anvil_page_icon, loader: () => import('../asset/icons/anvil_page_icon.m.svg') },
    { name: Resources.sword_border, loader: () => import('../asset/icons/sword_border.m.svg') },
    { name: Resources.about_icon, loader: () => import('../asset/icons/about_icon.m.svg') },
]


/**
 * 
 * @param {onEachLoad} onEachLoad
 * @returns {{[string]: any}}
 */
export async function loadResources(onEachLoad) {
    let allResObj = {};
    let numberOfLoadedResources = 1;

    for (let i = 0; i < resourcesList.length; i++) {
        const resource = resourcesList[i];
        const { default: asset } = await resource.loader();
        numberOfLoadedResources += 1;
        onEachLoad(asset, numberOfLoadedResources, resourcesList.length + 1);
        allResObj[resource.name] = asset;
    }

    return allResObj;
}

/**
 * @callback onEachLoad
 * @param {import('../types/resources').Resources} asset
 * @param {number} numberOfLoadedResources
 * @param {number} numberOfAllResources
 * @return {void}
 */