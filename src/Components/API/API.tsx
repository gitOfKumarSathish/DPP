import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const ApiUrl = {
    getFuncNodes: "https://mocki.io/v1/0f770953-182c-4073-a9fc-f5effccb001d",
    loadDagList: "https://mocki.io/v1/7dea7725-5f86-49ee-8280-05c24b8d2dd7",
    saveDag: "https://mocki.io/v1/7dea7725-5f86-49ee-8280-05c24b8d2dd7",
    loadDag: "https://dagger.free.beeceptor.com/",
};

function GetQueryMethod(url: string, key: string) {
    return useQuery({
        queryKey: [key], // unique key
        queryFn: async () => {
            const response = await axios.get(url);
            return response.data;
        },
        // staleTime: 10 * 60 * 1000, // 5 minutes // which will memorize the API response for given time
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });
}

const GetNormalMethod = async (url: any) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
};

async function PostMethod(url: string, data: any, path = '') {
    const finalUrl = url + path;
    console.log('finalUrl', finalUrl);
    const resp = await axios.post(url, data);
    return resp.data;
}






// export function getFuncNodes() {
//     let url = ApiUrl.getFuncNodes;
//     return GetQueryMethod(url, 'funcNodes');
// }

// export function getDagList() {
//     let url = ApiUrl.loadDagList;
//     return GetQueryMethod(url, 'dagList');
// }

export function getFuncNodes() {
    let url = ApiUrl.getFuncNodes;
    return GetNormalMethod(url);
}

export function getDagList() {
    let url = ApiUrl.loadDagList;
    return GetNormalMethod(url);
}



export const saveDag = async (data: any) => {
    let url = ApiUrl.saveDag;
    return PostMethod(url, data);
};

export const loadDag = async (data: any) => {
    let url = ApiUrl.loadDag + data;
    return GetNormalMethod(url);
};




