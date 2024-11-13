import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import  qrCodeSvg from "./scan.svg"

const SCANNER_STATUS = {
    RUNNING: 'RUNNING',
    STOPPED: 'STOPPED',
    PAUSED: 'PAUSED',
}

const QRCODE_ELEMENT_ID = 'qr-code-container';
const QRCODE_CONTAINER_SIZE = 300

const QRScanner = () => {
    const [scanResult, setScanResult] = useState([""]);
    const [isScanning, setIsScanning] = useState(SCANNER_STATUS.STOPPED);
    const html5QrCodeRef = useRef(null);

    const startScanning = async () => {
        if (!html5QrCodeRef.current) {
            html5QrCodeRef.current = new Html5Qrcode(QRCODE_ELEMENT_ID);
        }

        const config = {
            fps: 10,
            qrbox: { width: QRCODE_CONTAINER_SIZE, height: QRCODE_CONTAINER_SIZE },
        };

        html5QrCodeRef.current
            .start(
                { facingMode: 'environment' },
                config,
                (decodedText) => {
                    setScanResult(prev => [...prev, decodedText]);
                    setIsScanning(SCANNER_STATUS.STOPPED);
                },
                (err) => {
                    console.warn('Ошибка сканирования:', err);
                }
            )
            .catch((err) => console.error('Ошибка инициализации камеры:', err));
    };

    const stopScanning = () => {
        if (html5QrCodeRef.current) {
            html5QrCodeRef.current.stop()
        }
    };

    useEffect(() => {
        if (isScanning === SCANNER_STATUS.RUNNING) {
            startScanning();
        }else{
            stopScanning()
        }
    }, [isScanning]);

    const handleScan = () => {
        setIsScanning(SCANNER_STATUS.RUNNING);
    };

    const handleCopy = () => {
        window.navigator.clipboard.writeText(scanResult[scanResult.length - 1]);
    }
    return (
        <div style={{
            backgroundColor: 'black',
            width: "100%",
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: "start",
            alignItems: "center",
            color:"white"
        }}>
            <h1>QR Scanner</h1>
               <div style={{
                   width: QRCODE_CONTAINER_SIZE,
                   height: QRCODE_CONTAINER_SIZE,
                   marginBottom: "24px",
                   borderRadius: "8px",
                   border: '1px solid white',
                   backgroundImage: `url(${qrCodeSvg})`,
                   backgroundPosition: 'center',
                   backgroundSize: '110%',
                   overflow: 'hidden',
                   minHeight: QRCODE_CONTAINER_SIZE
               }}>
                   <div id={QRCODE_ELEMENT_ID} />
               </div>
                <button style={{
                    padding: "16px 32px",
                    fontSize: '16px',
                    fontWeight: "500",
                    borderRadius: "8px",
                    border: "none",
                    marginBottom: "16px",
                }} onClick={handleScan}>
                    Сканировать QR-код
                </button>
            <div style={{width: "90vw", margin: "0 auto", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                <a href={scanResult[scanResult.length - 1]} target="_blank" rel="noopener noreferrer"
                   style={{color: 'white', textAlign: "center", marginBottom: "10px"}}>
                    {scanResult[scanResult.length - 1]}
                </a>
                {scanResult[scanResult.length - 1]?.length ?
                    <button style={{
                    padding: "16px 32px",
                    fontSize: '16px',
                    fontWeight: "500",
                    borderRadius: "8px",
                    border: "none",
                    marginBottom: "16px",
                }} onClick={handleCopy}>
                    Скапировать
                </button> : null}
            </div>
        </div>
    );
};

export default QRScanner;
