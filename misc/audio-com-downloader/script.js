async function downloadAudio() {
    const url = document.getElementById('audioUrl').value;
    
    // Call your Python server
    const response = await fetch('http://localhost:5000/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url })
    });

    // Handle the file download
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'audio.mp3';
    a.click();
}
