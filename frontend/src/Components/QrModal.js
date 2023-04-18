import { useState, useEffect, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { Store } from '../Store';
import QRCode from "react-qr-code";
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../util';

function QrModal() {
    const [barcodeValue, setBarcodeValue] = useState();
    const [loading, setLoading] = useState(true);
    const { state } = useContext(Store);
    const { userInfo } = state;
    const navigate = useNavigate()

    useEffect(() => {
        if (!userInfo) {
            navigate('/')
            return
        }
        const fetchData = async () => {
            try {
                const config = {
                    headers: {
                        "authorization": `Bearer ${userInfo.token}`
                    }
                }
                setLoading(true)
                const { data } = await axios.get('/api/users/login/barcode', config)
                setLoading(false)
                setBarcodeValue(data);
            } catch (error) {
                toast.error(`${getError(error)}`)
            }
        }
        fetchData()
    }, [])

    console.log(barcodeValue);
    return (
        <div size="lg" isCentered>
            {loading ? <h1>Loading</h1> :
                barcodeValue && <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "200px", margin: "25% auto"  }}
                    value={barcodeValue.uuid}
                    viewBox={`0 0 256 256`} />
            }
        </div>
    )
}

export default QrModal
