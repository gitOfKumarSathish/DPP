import React, { useState, memo, useEffect } from 'react';
import CopyIcon from './../../assets/images/files.png';
import * as API from '../API/API';

function Save(props: {
    onDataUploaded(parsedData: any): unknown; data?: any; type?: any; onClose?: any;
}) {

    const data = JSON.stringify(props.data, null, 2);
    const { onClose } = props;
    const [copied, setCopied] = useState(false);
    const [dagName, setDagName] = useState('');


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
            // console.log('x', x);
            // Response Handler
        }).catch(err => console.log('error', err.message));
    };



    return (
        <div className='ModalBox'>
            <form onSubmit={submitHandler} className='jsonData'>
                <h3 className='ModalTitle'>Copy Your JSON</h3>
                <div className='dagNameSection'>
                    <label htmlFor="text">Name:</label>
                    <input id="text" name="text" className="dagNameBox" placeholder='Name of DAG' required onChange={dagNameHandler} />
                </div>
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
    );
}

export default memo(Save);
