/**
 * Image moderation using Google Cloud Vision SafeSearch API.
 * Free tier: 1,000 images/month.
 * Checks for adult, violence, racy content before allowing upload.
 */

const VISION_API_URL = 'https://vision.googleapis.com/v1/images:annotate';

// Likelihood levels from Google Vision
type Likelihood = 'UNKNOWN' | 'VERY_UNLIKELY' | 'UNLIKELY' | 'POSSIBLE' | 'LIKELY' | 'VERY_LIKELY';

interface SafeSearchResult {
  adult: Likelihood;
  violence: Likelihood;
  racy: Likelihood;
  medical: Likelihood;
  spoof: Likelihood;
}

export interface ModerationResult {
  safe: boolean;
  reason?: string;
}

// These levels are considered unsafe
const UNSAFE_LEVELS: Likelihood[] = ['LIKELY', 'VERY_LIKELY'];

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      // Strip "data:image/jpeg;base64," prefix
      resolve(dataUrl.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Check if an image is safe to upload using Google Vision SafeSearch.
 * Returns { safe: true } or { safe: false, reason: "..." }
 */
export async function moderateImage(imageBlob: Blob): Promise<ModerationResult> {
  const apiKey = import.meta.env.VITE_GOOGLE_VISION_API_KEY;

  // If no API key configured, allow upload (graceful degradation)
  if (!apiKey) {
    console.warn('No VITE_GOOGLE_VISION_API_KEY set — skipping moderation');
    return { safe: true };
  }

  try {
    const base64 = await blobToBase64(imageBlob);

    const response = await fetch(`${VISION_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [{
          image: { content: base64 },
          features: [{ type: 'SAFE_SEARCH_DETECTION' }],
        }],
      }),
    });

    if (!response.ok) {
      console.error('Vision API error:', response.status);
      // On API error, allow upload (don't block users)
      return { safe: true };
    }

    const data = await response.json();
    const annotation: SafeSearchResult = data.responses?.[0]?.safeSearchAnnotation;

    if (!annotation) {
      return { safe: true };
    }

    // Check each category
    if (UNSAFE_LEVELS.includes(annotation.adult)) {
      return { safe: false, reason: 'Contenido para adultos detectado. Solo se permiten fotos de cervezas.' };
    }
    if (UNSAFE_LEVELS.includes(annotation.violence)) {
      return { safe: false, reason: 'Contenido violento detectado. Solo se permiten fotos de cervezas.' };
    }
    if (UNSAFE_LEVELS.includes(annotation.racy)) {
      return { safe: false, reason: 'Contenido inapropiado detectado. Solo se permiten fotos de cervezas.' };
    }

    return { safe: true };
  } catch (err) {
    console.error('Moderation check failed:', err);
    // On network error, allow upload
    return { safe: true };
  }
}
