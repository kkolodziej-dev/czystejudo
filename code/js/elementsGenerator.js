let windowSize = window.innerWidth;
const DOCUMENT_FOLDER_PATH = 'https://kkolodziej-dev.github.io/czystejudo/entities/documents/';
const DOCUMENT_NAMES = 'documentPicNames.txt'
// const DOCUMENT_FOLDER_PATH = './entities/documents/';
const PHOTO_FOLDER_PATH = 'https://kkolodziej-dev.github.io/czystejudo/entities/gallery/';
// const PHOTO_FOLDER_PATH = './entities/gallery/';
const PHOTO_NAMES = 'imageNames.txt'

let DOCUMENT_PIC_NAMES_ARRAY = [];
let DOCUMENT_NAMES_ARRAY = [];
let PHOTO_NAMES_ARRAY = [];

let currentURL = window.location.href;

let documentListElement = document.getElementById('documentList');
let galleryContainerElement = document.getElementById('galleryContainer');

document.addEventListener('DOMContentLoaded', async () => {
    //populate elements
    if(currentURL.includes('references')) {
        await setElementsArray('documents');
        await populateElementFields('documents');
    } else if(currentURL.includes('gallery')) {
        await setElementsArray('gallery');
        await populateElementFields('gallery');
        $('#galleryContainer').magnificPopup({type:'image', delegate:'img'});
    }
    
    async function populateElementFields(flag) {
        let folderPath, elementList;
        switch (flag) {
            case 'documents':
                folderPath = DOCUMENT_FOLDER_PATH;
                elementList = DOCUMENT_PIC_NAMES_ARRAY;
                DOCUMENT_NAMES_ARRAY = await fetch(folderPath + 'docs/docMapping.json').then(response => response.json());
                break;
            case 'gallery':
                folderPath = PHOTO_FOLDER_PATH;
                elementList = PHOTO_NAMES_ARRAY;
                break;
        }
        let elementArray = [];
        //construct the documents
        elementList.forEach(e => {
            let tempContainerMember;
                    //create single image
                    let tempImg = document.createElement("img");
                    tempImg.setAttribute('src', folderPath + e);
                    tempImg.setAttribute('href', folderPath + e);
                    tempImg.setAttribute('alt', e);
                    tempImg.className = 'galleryImage image fit';

                    //append span to div
                    tempContainerMember = document.createElement("div");
                    tempContainerMember.className = windowSize > 736 ? "col-4" : "col-10";
                    tempContainerMember.id = e;
                    tempContainerMember.setAttribute('title', e);
                    tempContainerMember.appendChild(tempImg);
                    setEventListeners(folderPath, tempImg, e);
                    elementArray.push(tempContainerMember);
                    // break;
            // }
        })

        //append ready document objects to the document list element
        elementArray.forEach(e => {
            switch (flag) {
                case 'documents':
                    documentListElement.appendChild(e);
                    break;
                case 'gallery':
                    galleryContainerElement.appendChild(e);
                    break;
            } 
        })
    }
    
    function setEventListeners(folderPath, e, text) {
        e.addEventListener('mouseover', () => {
            e.style.cursor = 'pointer';
        })
        
        if (folderPath === DOCUMENT_FOLDER_PATH) {
        e.addEventListener('click', () =>  {
            download(folderPath, text);
        });
        }
    }
    
    function download(folderPath, elementName) {
        let docRefName = '';
        DOCUMENT_NAMES_ARRAY.forEach(mappingElement => {
            if(mappingElement.picture === elementName) {
                docRefName = mappingElement.document;
            }
        })
        if(docRefName === '') return;
        let element = document.createElement('a');
        element.setAttribute('href', folderPath + 'docs/' + docRefName);
        element.setAttribute('target', '_blank');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }

    async function setElementsArray(flag) {
        let lFolderPath;
        let lNamesFile;
        switch (flag) {
            case 'documents':
                lFolderPath = DOCUMENT_FOLDER_PATH;
                lNamesFile = DOCUMENT_NAMES;
                break;
            case 'gallery':
                lFolderPath = PHOTO_FOLDER_PATH;
                lNamesFile = PHOTO_NAMES;
                break;
        }

        let rawText = await fetch(lFolderPath + lNamesFile)
        .then(response => response.text());

        const parsedArr = rawText.split('\n');
        let filteredArr = parsedArr.filter(e => {
            if (e === lNamesFile || e === "" || e === "docs") return;
            return e;
        })

        switch (flag) {
            case 'documents':
                DOCUMENT_PIC_NAMES_ARRAY = filteredArr;
                break;
            case 'gallery':
                PHOTO_NAMES_ARRAY = filteredArr;
                break;
        }
    }
    });
