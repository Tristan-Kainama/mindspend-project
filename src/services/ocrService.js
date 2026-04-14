const API_KEY = import.meta.env.VITE_GOOGLE_VISION_KEY

export async function extractTextFromImage(base64Image) {
  try {
    const res = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: base64Image
              },
              features: [
                {
                  type: 'TEXT_DETECTION'
                }
              ]
            }
          ]
        })
      }
    )

    const data = await res.json()

    const text =
      data.responses?.[0]?.fullTextAnnotation?.text || ''

    return text

  } catch (err) {
    console.error('OCR ERROR:', err)
    return null
  }
}

export function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = error => reject(error)
  })
}