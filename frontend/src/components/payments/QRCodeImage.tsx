import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

interface QRCodeImageProps {
  payload: string
  size?: number
}

export default function QRCodeImage({ payload, size = 180 }: QRCodeImageProps) {
  const [dataUrl, setDataUrl] = useState<string>('')

  useEffect(() => {
    let active = true
    QRCode.toDataURL(payload, { width: size, margin: 1 })
      .then((url: string) => {
        if (active) setDataUrl(url)
      })
      .catch(() => {
        if (active) setDataUrl('')
      })

    return () => {
      active = false
    }
  }, [payload, size])

  if (!dataUrl) return null

  return <img src={dataUrl} alt="UPI QR" className="h-auto w-full" />
}
