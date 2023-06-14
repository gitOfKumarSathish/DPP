import React, { memo, useEffect, useState } from 'react';
import * as API from '../API/API';

function Load(props: {
    onDataUploaded(parsedData: any): unknown; data?: any; type?: any; onClose?: any;
}) {
    const { onClose } = props;
    const [data, setData] = useState(JSON.stringify(props.data, null, 2));
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [openEditor, setOpenEditor] = useState(false);
    const [errorExist, setErrorExist] = useState(false);
    const [selectDag, setSelectDag] = useState('');
    const [dagListResponse, setDagListResponse] = useState([]);

    const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setData(event.target.value);
    };


    useEffect(() => {
        const fetchData = async () => {
            const resp = await API.getDagList();
            setDagListResponse(resp);
        };
        fetchData();
    }, []);

    const handleDagSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        // mutation.mutate(selectDag);
        API.loadDag(selectDag).then(x => {
            props.onDataUploaded(x);
            setShowErrorMessage(false);
            onClose();
        }).catch(err => {
            console.log('error', err.message);
            setShowErrorMessage(true);
        });
    };


    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        try {
            const parsedData = JSON.parse(data);
            props.onDataUploaded(parsedData);
        } catch (error) {
            setErrorExist(true);
            return;
        }
        if (props.type === 'upload') {
            localStorage.setItem('data', data);
        } else {
            navigator.clipboard.writeText(data);
        }
        onClose();
    };

    const loadDag = async (e: { target: { value: string; }; }) => {
        setSelectDag(e.target.value);
    };
    return (
        <div className='ModalBox'>
            <h3 className='ModalTitle'>DAG Load</h3>
            {!openEditor &&
                <form onSubmit={handleDagSubmit}>
                    <div className='dagList'>
                        <label htmlFor="dagList">Choose your Dag:</label>
                        <select name="dagList" id="dagList" defaultValue="" onChange={loadDag}>
                            <option disabled value="">Select a Dag</option>
                            {
                                dagListResponse?.map((option: { value: string, label: string; }) => (
                                    <option key={option?.value} value={option?.value}>
                                        {option?.label}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    {showErrorMessage && <p className='jsonError'>The JSON upload failed. Please check the JSON and try again</p>}
                    <button type="submit" className='uploadSubmitButton btnSize'>Load</button>
                    <button onClick={onClose} className='uploadCancelButton btnSize'>Close</button>
                </form>
            }
            {openEditor && <form onSubmit={handleSubmit}>
                {/* <h3 className='ModalTitle'>Paste Your JSON</h3> */}
                <textarea
                    name="data"
                    value={data}
                    onChange={handleChange}
                    className='textAreaSize'
                    placeholder="Paste Your JSON"
                    required
                />
                {errorExist && <p className='jsonError'>The JSON upload failed. Please check the JSON and try again</p>}
                <button type="submit" className='uploadSubmitButton btnSize'>Load</button>
                <button onClick={onClose} className='uploadCancelButton btnSize'>Close</button>
            </form>}

            {!openEditor ?
                <p className='sampleText'><span onClick={() => setOpenEditor(true)} className='clickHere'><b>Click here</b> </span>to Enter DAG JSON</p>
                :
                <p className='sampleText'><span onClick={() => setOpenEditor(false)} className='clickHere'><b>Click here</b> </span> to Select a Dag</p>
            }

        </div>
    );
}

export default memo(Load);
