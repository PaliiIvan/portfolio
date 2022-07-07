export const Resources = {
     yggdrasil: 'yggdrasil',
}

const resourcesList = [
   { name: Resources.yggdrasil,  loader: () => import('../asset/icons/tree.m.svg')},
]
  

/**
 * 
 * @param {onEachLoad} onEachLoad
 * @returns 
 */
export async function loadResources(onEachLoad) {
    let allResObj = {};
    let numberOfLoadedResources = 1;

    for(let i = 0; i < resourcesList.length; i++) {
       const resource = resourcesList[i];
        const { default: asset } = await resource.loader();
        onEachLoad(asset, numberOfLoadedResources, resourcesList.length + 1);
        allResObj[resource.name] = asset;
    }
    await new Promise(r => setTimeout(r, 1000));

    return allResObj;
}

/**
 * @callback onEachLoad
 * @param {import('../types/resources').Resources} asset
 * @param {number} numberOfLoadedResources
 * @param {number} numberOfAllResources
 * @return {void}
 */