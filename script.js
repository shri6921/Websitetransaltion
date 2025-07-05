document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('camera');
    const canvas = document.getElementById('canvas');
    const captureBtn = document.getElementById('capture-btn');
    const toggleCameraBtn = document.getElementById('toggle-camera');
    const originalTextDiv = document.getElementById('original-text');
    const translatedTextDiv = document.getElementById('translated-text');
    const languageSelect = document.getElementById('language-select');
    const languageNameSpan = document.getElementById('language-name');
    
    let stream = null;
    let isFrontCamera = false;
    const languageNames = {
        'mr': 'Marathi',
        'hi': 'Hindi',
        'ta': 'Tamil',
        'te': 'Telugu'
    };
    
    // Initialize the camera
    async function initCamera() {
        try {
            const constraints = {
                video: {
                    facingMode: isFrontCamera ? 'user' : 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };
            
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            video.srcObject = stream;
        } catch (err) {
            console.error('Error accessing camera:', err);
            alert('Could not access the camera. Please ensure you have granted camera permissions.');
        }
    }
    
    // Capture image from video and process text
    captureBtn.addEventListener('click', async function() {
        if (!stream) {
            alert('Camera is not initialized. Please try again.');
            return;
        }
        
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame to canvas
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Show loading state
        originalTextDiv.textContent = 'Processing text...';
        translatedTextDiv.textContent = '';
        
        try {
            // Use Tesseract.js for OCR
            const { data: { text } } = await Tesseract.recognize(
                canvas,
                'eng',
                { logger: m => console.log(m) }
            );
            
            originalTextDiv.textContent = text.trim() || 'No text detected';
            
            if (text.trim()) {
                // Translate the text
                await translateText(text, languageSelect.value);
            }
        } catch (err) {
            console.error('Error processing text:', err);
            originalTextDiv.textContent = 'Error processing text';
        }
    });
    
    // Translate text using Google Translate API
    async function translateText(text, targetLang) {
        translatedTextDiv.textContent = 'Translating...';
        
        try {
            // Note: In a production app, you should use a proper translation API with a backend
            // to avoid exposing API keys. This is a simplified approach using the Google Translate web API.
            
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data && data[0] && data[0][0] && data[0][0][0]) {
                translatedTextDiv.textContent = data[0][0][0];
            } else {
                translatedTextDiv.textContent = 'Translation failed';
            }
        } catch (err) {
            console.error('Translation error:', err);
            translatedTextDiv.textContent = 'Error during translation';
        }
    }
    
    // Toggle between front and back camera
    toggleCameraBtn.addEventListener('click', async function() {
        isFrontCamera = !isFrontCamera;
        
        // Stop the current stream
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        
        // Initialize with the other camera
        await initCamera();
    });
    
    // Update language name when selection changes
    languageSelect.addEventListener('change', function() {
        languageNameSpan.textContent = languageNames[this.value] || this.value;
    });
    
    // Initialize the app
    initCamera();
});