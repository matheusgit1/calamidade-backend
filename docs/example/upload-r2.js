async function uploadFile(file) {
  
  const response = await fetch('/api/file/presigned-url', {
    method: 'POST',
    body: JSON.stringify({
      fileName: file.name,
      mimeType: file.type,
      folder: 'receipts'// ENUM(receipts,accidents)
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  const { url, key, fileId } = data;

  //Usar o fileId para vincular na requisição que for usar

  const uploadResponse = await fetch(url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type
    }
  });

  if (uploadResponse.ok) {
    console.log('File uploaded successfully');
  } else {
    console.error('File upload failed');
  }

}