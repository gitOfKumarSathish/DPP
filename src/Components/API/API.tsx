import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const ApiUrl = {
    getFuncNodes: "https://mocki.io/v1/0f770953-182c-4073-a9fc-f5effccb001d",
    loadDag: "https://mocki.io/v1/7dea7725-5f86-49ee-8280-05c24b8d2dd7",
    saveDag: "https://mocki.io/v1/7dea7725-5f86-49ee-8280-05c24b8d2dd7",
};

function GetMethod(url: string, key: string) {
    return useQuery({
        queryKey: [key], // unique key
        queryFn: async () => {
            const response = await axios.get(url);
            return response.data;
        },
        staleTime: 10 * 60 * 1000, // 5 minutes // which will memorize the API response for given time
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });
}

async function PostMethod(url: string, data: any) {
    const resp = await axios.post(url, data);
    return resp.data;
}

export function getFuncNodes() {
    let url = ApiUrl.getFuncNodes;
    return GetMethod(url, 'funcNodes');
}

export function getDagList() {
    let url = ApiUrl.loadDag;
    return GetMethod(url, 'dagList');
}

export const saveDag = async (data: any) => {
    let url = ApiUrl.saveDag;
    return PostMethod(url, data);
}


