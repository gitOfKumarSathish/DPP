import axios from 'axios';

const ApiUrl = {
    getFuncNodes: "https://mocki.io/v1/0f770953-182c-4073-a9fc-f5effccb001d",
    loadDagList: "https://mocki.io/v1/7dea7725-5f86-49ee-8280-05c24b8d2dd7",
    saveDag: "https://mocki.io/v1/7dea7725-5f86-49ee-8280-05c24b8d2dd7",
    loadDag: "https://dagger.free.beeceptor.com/",
};


const GetMethod = async (url: any) => {
    const response = await axios.get(url);
    return response.data;
};

async function PostMethod(url: string, data: any) {
    const response = await axios.post(url, data);
    return response.data;
}

export function getFuncNodes() {
    let url = ApiUrl.getFuncNodes;
    return GetMethod(url);
}

export function getDagList() {
    let url = ApiUrl.loadDagList;
    return GetMethod(url);
}


export const loadDag = async (data: any) => {
    let url = ApiUrl.loadDag + data;
    return GetMethod(url);
};

export const saveDag = async (data: any) => {
    let url = ApiUrl.saveDag;
    return PostMethod(url, data);
};





