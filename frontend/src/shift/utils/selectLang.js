export function selectAboutTitle(item) {
    let lang = localStorage.getItem("lang");
    if (lang === "ENG"||lang===null) {
        return {id: item?.id, title: item?.title, description: item?.description}
    } else if (lang === "UZB") {
        return {id: item?.id, title: item?.title_UZB, description: item?.description_UZB}
    } else if (lang === "RUS") {
        return {id: item?.id, title: item?.title_RUS, description: item?.description_RUS}
    }
}


export function selectLAngWhyUs(array) {
    let lang = localStorage.getItem("lang");
    let arr = [];
    if (lang === "ENG"||lang===null) {
        array?.map(item => arr.push({id: item?.id, title: item?.title, description: item?.description,attachment:item.attachment?.id}))
        return arr;
    } else if (lang === "UZB") {
        array?.map(item => arr.push({id: item?.id, title: item?.title_UZB, description: item?.description_UZB,attachment:item.attachment?.id}))
        return arr;
    } else if (lang === "RUS") {
        array?.map(item => arr.push({id: item?.id, title: item?.title_RUS, description: item?.description_RUS,attachment:item.attachment?.id}))
        return arr;
    }
}

export function selectLangOurTeamDesc(array){
    let lang = localStorage.getItem("lang");
    let arr = [];
    if (lang === "ENG"||lang===null) {
        array?.map(item => arr.push({id: item?.id, name: item?.name, description: item?.description,attachment:item.attachment?.id}))
        return arr;
    } else if (lang === "UZB") {
        array?.map(item => arr.push({...item, description: item?.description_UZB,attachment:item.attachment?.id}))
        return arr;
    } else if (lang === "RUS") {
        array?.map(item => arr.push({...item, description: item?.description_RUS,attachment:item.attachment?.id}))
        return arr;
    }
}

export  function selectLangAddress(item){
    let lang = localStorage.getItem("lang");
    if (lang === "ENG"||lang===null) {
        return item;
    } else if (lang === "UZB") {
        return {...item,address:item?.address_UZB}
    } else if (lang === "RUS") {
        return {...item,address:item?.address_RUS}

    }
}