document.addEventListener('DOMContentLoaded', () => {
    const convertBtn = document.getElementById('convertBtn');
    
    convertBtn.addEventListener('click', () => {
        const inputUrl = document.getElementById('audioUrl').value.trim();
        
        if (!inputUrl.includes('audio.com')) {
            alert('Please enter a valid audio.com URL.');
            return;
        }

        try {
            const urlObj = new URL(inputUrl);
            const pathSegments = urlObj.pathname.split('/').filter(Boolean);
            
            if (pathSegments.length >= 3) {
                const author = pathSegments[0];
                const audioTitle = pathSegments[2]; 
                
                const mp3Url = `https://audio.com{author}/audio/${audioTitle}/audio.mp3`;

                const downloadLink = document.getElementById('downloadLink');
                downloadLink.href = mp3Url;

                document.getElementById('result').style.display = 'block';
            } else {
                alert('Please try again. Invalid URL');
            }
        } catch (e) {
            alert('Invalid URL format.');
        }
    });
});
