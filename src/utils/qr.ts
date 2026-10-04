import QRCode from 'qrcode';

export async function generateCertificateQRCode(text: string): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      width: 140,
      margin: 1,
      color: {
        dark: '#1e293b',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M',
    });
    return dataUrl;
  } catch (err) {
    console.error('Error generating QR code:', err);
    return '';
  }
}
