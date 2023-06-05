import React, { useState, useEffect, memo } from 'react';

function UploadDownload(props: any) {
    const { onClose, type } = props;
    const [data, setData] = useState('');
    const [copied, setCopied] = useState(false);
    const [errorExist, setErrorExist] = useState(false);
    const [dataType, setDataType] = useState({ title: 'Paste Your JSON', type: type, data: props.data });

    const handleChange = (event: { target: { value: any; }; }) => {
        const value = event.target.value;
        setData(value);
    };

    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        // Check if the data is a valid JSON object
        try {
            JSON.parse(data);
        } catch (error) {
            setErrorExist(true);
            return false;
        }
        localStorage.setItem('data', (data));
        // The data is a valid JSON object
        onClose(false);
        return true;
    };

    useEffect(() => {
        if (dataType.type === 'download') {
            setDataType({ title: 'Copy Your JSON', type: type, data: props.data });
        } else {
            setDataType({ title: 'Paste Your JSON', type: type, data: data });
        }
    }, [props]);
    console.log('dataType', dataType);
    console.log('data', data);

    const handleCopy = () => {
        const el = document.createElement('textarea');
        el.textContent = JSON.stringify(dataType.data, null, 2);
        el.select();
        console.log('el', el);
        // document.execCommand('copy');
        navigator.clipboard.writeText(el.textContent);
        setCopied(true);
    };
    return (
        <div className='ModalBox'>
            <div>
                {dataType?.type === 'upload' ?
                    <form onSubmit={handleSubmit}>
                        <h3 className='ModalTitle'>{dataType.title}</h3>
                        <textarea
                            name="data"
                            value={data}
                            onChange={handleChange}
                            className='textAreaSize'
                            placeholder={dataType.title}
                            required
                        />
                        {errorExist && <p className='jsonError'>The JSON upload failed. Please check the JSON and try again</p>}
                        <button type="submit" className='uploadSubmitButton btnSize'>Submit</button>
                        <button onClick={onClose} className='uploadCancelButton btnSize'>Close</button>
                    </form>
                    :
                    <>
                        <h3 className='ModalTitle'>{dataType.title}</h3>
                        <textarea
                            name="data"
                            id="textarea"
                            value={JSON.stringify(dataType.data)}
                            onChange={handleChange}
                            className='textAreaSize'
                            placeholder={dataType.title}
                            required
                        />
                        <button onClick={handleCopy} className='uploadSubmitButton btnSize'>{copied ? 'Copied!' : 'Copy'} </button>

                        <button onClick={onClose} className='uploadCancelButton btnSize'>Close</button>
                    </>
                }
            </div>

        </div>

    );
}

export default memo(UploadDownload);