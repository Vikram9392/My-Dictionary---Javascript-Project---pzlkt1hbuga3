// JS FOR SEARCH PAGE 
// SELECTION ALL THE ELEMEMTS FROM THE DOCUMENT
const inputword = document.getElementById('srch');
const searchbtn = document.getElementById('searchbtn');
const display = document.getElementById('display');
const footer = document.getElementsByTagName('footer')[0];
const hiscards = document.getElementsByClassName('his-cards')[0];
const emptycard = document.querySelector('.emptycard');
const history = document.querySelector('#history');
const searchBack = document.querySelector('#searchback');

const left = document.getElementById('left');
const right = document.getElementById('right');

const searchSection = document.querySelector('.search-box');
const hisSection = document.querySelector('.history-box');

var Searchhistory = [];

(function updateLocalStorage(){
    if(localStorage.getItem('dic-his')){
        Searchhistory = JSON.parse(localStorage.getItem('dic-his'));
        createCards();
    }
})();

const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

// PUTTING EVENTLISTNER ON SEARCH BUTTON
// if(searchbtn){
    searchbtn.addEventListener('click',()=>{
        if(inputword.value == ''){
            alert('please enter something')
        }else{
            meaning(inputword.value);
            inputword.value = '';
            // footer.style.position = 'static';
        }
    })
// }

// GETTING DATA USING ASYNC FUNCTION
// USING AWAIT AND FETCH IN THIS FUCNTION
async function meaning(word){
    try{
        // FETCHING DATA;
        let data = await fetch(url+word);
        let actualdata = await data.json();

        // EXTRACTING SEARCH WORD Sword AND MEANING ARRAY
        let Sword = actualdata[0].word;
        let meaningArray = actualdata[0].meanings;
        let audioURL = `https://api.dictionaryapi.dev/media/pronunciations/en/${Sword}-us.mp3`;
        let audioA = `https://api.dictionaryapi.dev/media/pronunciations/en/${Sword}-uk.mp3`
        let audioB = `https://api.dictionaryapi.dev/media/pronunciations/en/${Sword}-au.mp3`

        let wordAudio = new Audio(audioURL);

        // EXTRA INFORMATION FLAG;
        let extraInfo = false;
        
        // CHECKING IF THE MEANINGARRAY IS GREATER THEN THREE 
        // IF GREATER THEN 3 THEN DIRECLTY TRUE 
        if(meaningArray.length > 3){
            extraInfo = true;
        } 
        else{
            // IF NOT THEN WE'LL CHECK ALL THE DEFINITIONS LENGHTS 
            // IF ANY DEFINATIONS ARE GREATER THEN 2;
            for(let objs of meaningArray){
                let defleng = objs.definitions.length;
                if(defleng > 2){
                    extraInfo = true;
                }
            }
        }
        
        // // INFO ON CONSOLE
        // console.log("Complete fetch data")
        // console.log(actualdata);
        // console.log(actualdata[0].phonetics)
        // console.log("Extracting meaning form fetch data")
        // console.table(meaningArray);
        // console.log("LENGTH OF ARRAY IS "+ meaningArray.length);
        // console.log(extraInfo?"Contains extra Info":"No extra Info");
        
        creatdisplay(Sword,extraInfo,meaningArray,wordAudio);
        let obj = {};
        obj.word = Sword;
        obj.meaning1 = meaningArray[0].definitions[0].definition;
        obj.meaning2 = meaningArray[0].definitions[1].definition;
        Searchhistory.unshift(obj);
        localStorage.setItem('dic-his',JSON.stringify(Searchhistory));

        checkLimit();
        createCards()
        // historyUpdate(obj);
    }
    catch(err){
        console.log(err);
        console.log('Error found in searching word');
        errorWord(inputword.value);
    }
}
// THIS IS A RESURSIVE FUNCTION ON CLOSER;
function createCards(){
    hiscards.innerHTML = '';
    if(Searchhistory.length === 0){
        hiscards.append(emptycard);
    }else{
        for(let ele of Searchhistory){
            let card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `<h1>${ele.word}</h1>
                                <hr>
                        <div class="meaning-content">
                        <h4>Meaning 1</h4>
                            <p>${ele.meaning1}</p>
                            <h4>Meaning 2</h4>
                            <p>${ele.meaning2}</p>
                        </div>`;
            let delbtn = document.createElement('button');
            delbtn.className = 'delete-btn'; 
            delbtn.innerHTML = `<img src="./images/delete.png" alt="">`
            delbtn.addEventListener('click',()=>{
                let index = Searchhistory.indexOf(ele);
    
                // DELETING IN ARRAY
                Searchhistory.splice(index,1);
                localStorage.setItem('dic-his',JSON.stringify(Searchhistory));
                createCards();;
            })
            card.appendChild(delbtn);
            hiscards.append(card);
        }
    }   
}
function checkLimit(){
    if(Searchhistory.length === 11){
        Searchhistory.splice(10,1);
        localStorage.setItem('dic-his',JSON.stringify(Searchhistory));
    }
}
function creatdisplay(Sword,extraInfo,meaningArray,audio){
    // BELOW LINE IS CREATING A LAYOUT FOR DISPLAYING DATA
    display.innerHTML = `<div class="heading">
                            <h1>Word : <span id="search-word">${Sword}</span></h1>
                            <button id="speak"><img src="./images/icons8-speaker-100.png" alt=""></button> 
                        </div>
                        <hr>
                        <div class="meaning"></div>`;

    let speak = document.getElementById('speak');
    speak.addEventListener('click',()=>{
        audio.play();
    })

    // CREATING VARIABLE FOR MEANING HERE ITSELF
    // WE ARE SENDING THIS VARIABLE IN BOTH DISPLAY FUNCTION SO IT GET ACCESS THERE WITHOUT CREATING NEW;
    let meaning = document.getElementsByClassName('meaning')[0];

    // IF CREATEDISPLAY IS CALLED DISPLAY DATA IS NESSECERRY 
    displayMinData(meaningArray,meaning);

    // IF IT CARRIES EXTRA INFORMATION THEN CREATING NEW BUTTON WITH EVENTLISTNER 
    if(extraInfo){
        let extraInfoBtn = document.createElement('button');
        extraInfoBtn.innerText = 'Read More';
        meaning.appendChild(extraInfoBtn);
        extraInfoBtn.addEventListener('click',()=>{
            displayingFullData(meaningArray,meaning);
        });
    }
    
}
// ERROR FUNCTION FOR SEARCHING WRONG WORD
function errorWord(errorword){
    display.innerHTML = `<h3>No Result Found for ${errorword}</h3>`;
}

// THIS FUNCTION WILL DISPLAY THE NESSERRAY DATA;
function displayMinData(meaningArray,meaning){

    // THIS FOR LOOP WILL RUN FOR 3 TIME FOR EXTRATING DATA
    for(let i=0;i<3;i++){
        let ele = meaningArray[i];
        if(meaningArray[i]){

            // CREATING A PERTICULAR DIV SECTION FOR A 'PartOfSpeach';
            let meaningListDiv = document.createElement('div');
            meaningListDiv.className = 'meaning-list';

            // APPENDING POS IN A P TAG 
            let pos = document.createElement('p');
            pos.innerText = ele.partOfSpeech;

            // CREATING ORDEREDLIST 
            let odrlist = document.createElement('ol');

            // console.log(ele.partOfSpeech);
            // BELOW LOOP WILL RUN FOR THE DEFINITIONS SECTION 2 TIMES
            for(let j=0;j<2;j++){
                let mea = ele.definitions[j]
                if(ele.definitions[j]){
                    odrlist.innerHTML += `<li>${mea.definition}</li>`;
                    // console.log(mea.definition);
                    if(mea.example){
                        odrlist.innerHTML += `<p>Example : ${mea.example}</p>`
                        // console.log("Example : "+ mea.example);
                    }
                }
            }
            // APPENDING ELEMENTS 
            meaningListDiv.appendChild(pos);
            meaningListDiv.appendChild(odrlist);
            meaning.append(meaningListDiv);
        }
    }
    
}

// THIS DISPLAYFULLDATA FUNCTION WILL DISPLAY FULL DATA OF THE WORD;
function displayingFullData(meaningArray,meaning){
    
    //CLEARING PREVIOUS DATA;
    meaning.innerHTML = '';

    // THIS FOR LOOP WILL RUN FOR TOTOAL LENGTH OF EXTRATING DATA
    for(let ele of meaningArray){

        // CREATING A PERTICULAR DIV SECTION FOR A 'PartOfSpeach';
        let meaningListDiv = document.createElement('div');
        meaningListDiv.className = 'meaning-list';

        // APPENDING POS IN A P TAG
        let pos = document.createElement('p');
        pos.innerText = ele.partOfSpeech;

        // CREATING ORDEREDLIST
        let odrlist = document.createElement('ol');
        
        // console.log(ele.partOfSpeech)

        // BELOW LOOP WILL RUN FOR THE DEFINITIONS SECTION COMPLETE
        for(let meDf of ele.definitions){
            odrlist.innerHTML += `<li>${meDf.definition}</li>`;
            // console.log(meDf.definition);
            if(meDf.example){
                odrlist.innerHTML += `<p>Example : ${meDf.example}</p>`
                // console.log("Example : "+ meDf.example); 
            } 
        }
        // APPENDING ELEMETS;
        meaningListDiv.appendChild(pos);
        meaningListDiv.appendChild(odrlist);
        meaning.append(meaningListDiv);
    }
}
/////ADDING AVENT LISTENERS;

// const history = document.querySelector('#history');
// const searchBack = document.querySelector('#searchback');

// const searchSection = document.querySelector('.search-box');
// const HisSection = document.querySelector('.history-box');


// QUOTE API FUNCTION;
const quote = document.querySelector('.quote h4');
const author = document.querySelector('.quote .author');

async function getquote(){
    let quotes = await fetch('https://api.quotable.io/random');
    let quoteData = await quotes.json();
    quote.innerText = quoteData.content;
    author.innerText = quoteData.author;
}
getquote();
setInterval(()=>{
    getquote();
},60000);
 
// ADDING EVENT LISTNERS;
history.addEventListener('click',()=>{
    hisSection.classList.toggle('hide');
    searchSection.classList.toggle('hide');
})
searchBack.addEventListener('click',()=>{
    hisSection.classList.toggle('hide');
    searchSection.classList.toggle('hide');
})
left.addEventListener('click',()=>{
    hiscards.scrollLeft -= 200;
})
right.addEventListener('click',()=>{
    hiscards.scrollLeft += 200;
})