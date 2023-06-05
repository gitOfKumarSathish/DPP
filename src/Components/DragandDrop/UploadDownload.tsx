import React, { useState, memo } from 'react';

function UploadDownload(props: {
    onDataUploaded(parsedData: any): unknown; data?: any; type?: any; onClose?: any;
}) {
    const { onClose } = props;
    const [data, setData] = useState(JSON.stringify(props.data, null, 2));
    const [copied, setCopied] = useState(false);
    const [errorExist, setErrorExist] = useState(false);

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

    return (
        <div className='ModalBox'>
            <div>
                {props.type === 'upload' ? (
                    <form onSubmit={handleSubmit}>
                        <h3 className='ModalTitle'>Paste Your JSON</h3>
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
                    </form>
                ) : (
                    <div>
                        <h3 className='ModalTitle'>Copy Your JSON</h3>
                        <textarea
                            name="data"
                            id="textarea"
                            value={data}
                            className='textAreaSize'
                            placeholder="Copy Your JSON"
                            required
                            readOnly
                        />
                        <button onClick={handleCopy} className='uploadSubmitButton btnSize'>{copied ? 'Copied!' : 'Copy'}</button>
                        <button onClick={onClose} className='uploadCancelButton btnSize'>Close</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default memo(UploadDownload);
