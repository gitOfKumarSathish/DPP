import React, { useState, memo, useEffect } from 'react';
import CopyIcon from './../../assets/images/files.png';
import * as API from './../API/API';

function UploadDownload(props: {
    onDataUploaded(parsedData: any): unknown; data?: any; type?: any; onClose?: any;
}) {
    const { onClose } = props;
    const [data, setData] = useState(JSON.stringify(props.data, null, 2));
    const [copied, setCopied] = useState(false);
    const [openEditor, setOpenEditor] = useState(false);
    const [dagName, setDagName] = useState('');
    const [errorExist, setErrorExist] = useState(false);
    const [selectDag, setSelectDag] = useState('');
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setData(event.target.value);
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

    const handleCopy = () => {
        navigator.clipboard.writeText(data);
        setCopied(true);
    };

    const dagNameHandler = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setDagName(event.target.value);
    };


    const submitHandler = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        const combinedObj = {
            dagName,
            ...props.data,
        };
        onClose();

        API.saveDag(combinedObj).then(x => {
            console.log('x', x);
        }).catch(err => console.log('error', err.message));
    };

    const loadDag = async (e: { target: { value: string; }; }) => {
        console.log('e', e.target.value);
        setSelectDag(e.target.value);
    };

    const handleDagSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        API.loadDag(selectDag).then(x => {
            console.log('object', x);
            props.onDataUploaded(x);
            setShowErrorMessage(false);
            onClose();
        }).catch(err => {
            console.log('errpr', err.message);
            setShowErrorMessage(true);
        });

    };

    const resp = API.getDagList();
    console.log('resp', resp.data);

    return (
        <div className='ModalBox'>
            {props.type === 'upload' ? (
                <>
                    <h3 className='ModalTitle'>DAG Load</h3>
                    {!openEditor &&
                        <form onSubmit={handleDagSubmit}>
                            <div className='dagList'>
                                <label htmlFor="dagList">Choose your Dag:</label>
                                <select name="dagList" id="dagList" defaultValue="" onChange={loadDag}>
                                    <option disabled value="">Select a Dag</option>
                                    {
                                        resp?.data?.map((option: { value: string, label: string; }) => (
                                            <option key={option?.value} value={option?.value}>
                                                {option?.label}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                            {showErrorMessage && <p className='jsonError'>The JSON upload failed. Please check the JSON and try again</p>}
                            <button type="submit" className='uploadSubmitButton btnSize'>Submit</button>
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
                        <button type="submit" className='uploadSubmitButton btnSize'>Submit</button>
                        <button onClick={onClose} className='uploadCancelButton btnSize'>Close</button>
                    </form>}

                    {!openEditor ?
                        <p className='sampleText'><span onClick={() => setOpenEditor(true)} className='clickHere'><b>Click here</b> </span>to Enter On Your Own</p>
                        :
                        <p className='sampleText'><span onClick={() => setOpenEditor(false)} className='clickHere'><b>Click here</b> </span> to Select Dag Templates</p>
                    }
                </>
            ) : (
                <div>

                    <form onSubmit={submitHandler} className='jsonData'>
                        <h3 className='ModalTitle'>Copy Your JSON</h3>
                        <div className='dagNameSection'>
                            <label htmlFor="text">Name:</label>
                            <input id="text" name="text" className="dagNameBox" placeholder='Name of DAG' required onChange={dagNameHandler} />
                        </div>
                        {/* <button onClick={handleCopy} className='uploadSubmitButton btnSize copyBtn'>{copied ? 'Copied!' : 'Copy'}</button> */}
                        {<img onClick={handleCopy} src={CopyIcon} alt='copyBtn' className='copyBtn' title={copied ? 'Copied!' : 'Copy'} />}
                        <textarea
                            name="data"
                            id="textarea"
                            value={data}
                            className='textAreaSize'
                            placeholder="Copy Your JSON"
                            required
                            readOnly
                        />
                        <button type="submit" className='uploadSubmitButton btnSize'>Submit</button>
                        <button onClick={onClose} className='uploadCancelButton btnSize'>Close</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default memo(UploadDownload);
