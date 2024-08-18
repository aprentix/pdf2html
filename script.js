const fileInput = document.getElementById('file');
const fileListDiv = document.getElementById('fileList');
const uploadForm = document.getElementById('uploadForm');
const contenido = document.getElementById('contenido');

fileInput.addEventListener('change', () => {
    const files = fileInput.files;
    fileListDiv.innerHTML = ''; // Clear previous list

    if (files.length > 0) {
        const list = document.createElement('ul');
        for (let i = 0; i < files.length; i++) {
            const listItem = document.createElement('li');
            listItem.textContent = `PDF: ${files[i].name}, Size: ${files[i].size} bytes`;
            list.appendChild(listItem);
        }
        fileListDiv.appendChild(list);
    } else {
        fileListDiv.textContent = 'No files selected';
    }
});

uploadForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(uploadForm);
    const file = formData.get('file');

    if (file && file.type === 'application/pdf') {
        const reader = new FileReader();

        reader.onload = async function(e) {
            const arrayBuffer = e.target.result;
            text_final = ""

            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            alert("PDF_pages: "+pdf.numPages)
            for (let i=1; i<pdf.numPages; i+=1){
                try{
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
    
                    let text = ' ';
                    textContent.items.forEach((item) => {
                        text += item.str + ' ';
                    });
    
                    text_final+=text+"<br><br><br>"
                }catch(error){
                    console.error('Error with page: '+i)
                }
            }   
            const texto_ele = document.createElement('div');
            texto_ele.innerHTML = text_final;
            contenido.append(texto_ele);
        };
        
        reader.readAsArrayBuffer(file);
    } else {
        console.error('Please upload a valid PDF file.');
    }
});




