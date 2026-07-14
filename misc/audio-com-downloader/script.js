document.addEventListener('DOMContentLoaded', () => {
    const convertBtn = document.getElementById('convertBtn');
    
    if (!convertBtn) return; // Safety check to prevent errors if element isn't on the page
    
    convertBtn.addEventListener('click', () => {
        const audioUrlElem = document.getElementById('audioUrl');
        if (!audioUrlElem) return;

        let inputUrl = audioUrlElem.value.trim();
        
        if (!inputUrl.includes('audio.com')) {
            alert('Please enter a valid audio.com URL.');
            return;
        }

        try {
            // Prepend https:// if the user pasted a raw domain like 'audio.com/...'
            if (!/^https?:\/\//i.test(inputUrl)) {
                inputUrl = `https://${inputUrl}`;
            }

            const urlObj = new URL(inputUrl);
            const pathSegments = urlObj.pathname.split('/').filter(Boolean);
            
            // Expected path format: /username/audio/track-title
            if (pathSegments.length >= 3) {
                const author = pathSegments[0];
                const audioTitle = pathSegments[2]; 
                
                // FIXED: Added missing '/' and '$'
                const mp3Url = `https://audio.com/${author}/audio/${audioTitle}/audio.mp3`;

                const downloadLink = document.getElementById('downloadLink');
                if (downloadLink) {
                    downloadLink.href = mp3Url;
                }

                const resultSection = document.getElementById('result');
                if (resultSection) {
                    resultSection.style.display = 'block';
                }
            } else {
                alert('Invalid audio.com track URL structure. Ensure it includes the user and track name.');
            }
        } catch (e) {
            alert('Invalid URL format.');
        }
    });
});
