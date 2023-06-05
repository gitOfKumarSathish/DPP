import React from 'react';

function UploadJson({ onClose }: any) {
    const [data, setData] = React.useState('');

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
            return false;
        }
        localStorage.setItem('data', (data));
        // The data is a valid JSON object
        onClose(false);
        return true;
    };
    return (
        <div className='ModalBox'>
            <div>
                <form onSubmit={handleSubmit}>
                    <h3 className='ModalTitle'>Paste Your JSON</h3>
                    <textarea
                        name="data"
                        value={data}
                        onChange={handleChange}
                        className='textAreaSize'
                        placeholder="Paste JSON here"
                        required
                    />
                    <button type="submit" className='uploadSubmitButton btnSize'>Submit</button>
                    <button onClick={onClose} className='uploadCancelButton btnSize'>Close</button>
                </form>
            </div>

        </div>

    );
}

export default UploadJson;