let flag = true;
async function fetchApi(word) {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await res.json();
    // console.log(data);
    if ("title" in data) show2("not found");
    else show(data);
}
document.getElementById('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    fetchApi(e.target.search.value);
});
function show(data) {
    const pNode = document.getElementById('card');
    pNode.innerHTML = '';
    const pNode2 = document.createElement('div');
    pNode2.className = 'more';
    const ch1 = document.createElement('h1');
    ch1.textContent = data[0].word;
    const cNodeDiv = document.createElement('div');
    cNodeDiv.textContent = data[0].meanings[data[0].meanings.length - 1].definitions[0].definition;
    const cNodeButton = document.createElement('button');
    cNodeButton.textContent = "Show More";
    cNodeButton.dataset.data = JSON.stringify(data);
    cNodeButton.setAttribute('onclick', `show3(this)`);
    pNode2.append(ch1, cNodeDiv, cNodeButton);
    pNode.append(pNode2);
    localStorage.setItem(data[0].word, JSON.stringify(data));
}
function show2(data) {
    const pNode = document.getElementById('card');
    pNode.innerHTML = '';
    const cNodeDiv = document.createElement('div');
    cNodeDiv.textContent = data;
    pNode.append(cNodeDiv);
}
function show3(elem) {
    const data = JSON.parse(elem.dataset.data);
    const pNode = document.getElementById('card');
    pNode.innerHTML = '';
    const pNode2 = document.createElement('div');
    pNode2.className = 'more';
    pNode.append(pNode2);
    const ch1 = document.createElement('h1');
    ch1.textContent = data[0].word;
    const adio = document.createElement('audio');
    // adio.src='';
    adio.setAttribute('controls', true);
    pNode2.append(ch1, adio);
    let i = 1;
    let aflag = true;
    for (const elem1 of data) {
        const pUl = document.createElement('ul');
        const pLi = document.createElement('li');
        pNode2.append(pUl);
        pUl.append(pLi);
        const ch5 = document.createElement('h5');
        ch5.textContent = i++;
        pLi.append(ch5);
        let j = 1
        if (elem1.phonetics.length != 0) {
            for (const elem2 of elem1.phonetics) {
                if (elem2.audio != '') {
                    adio.src = elem2.audio;
                    aflag = false;
                    break;
                }
            }
        }
        for (const elem2 of elem1.meanings) {
            const ul1 = document.createElement('ul');
            const h4 = document.createElement('h4')
            h4.textContent = elem2.partOfSpeech;
            ul1.append(h4);
            pLi.append(ul1);
            if (elem2.synonyms.length != 0) {
                const div1 = document.createElement('div');
                div1.className = 'sydiv1';
                ul1.append(div1);
                const div2 = document.createElement('div');
                div2.className = 'synow';
                div2.textContent = 'Synonyms- ';
                div1.append(div2);
                for (const elem3 of elem2.synonyms) {
                    const div3 = document.createElement('div');
                    div3.textContent = elem3 + ',';
                    div1.append(div3);
                }
            }
            if (elem2.antonyms.length != 0) {
                const div1 = document.createElement('div');
                div1.className = 'sydiv1';
                ul1.append(div1);
                const div2 = document.createElement('div');
                div2.className = 'synow';
                div2.textContent = 'Antonyms- ';
                div1.append(div2);
                for (const elem3 of elem2.antonyms) {
                    const div3 = document.createElement('div');
                    div3.textContent = elem3 + ',';
                    div1.append(div3);
                }
            }
            for (const elem3 of elem2.definitions) {
                const cLi = document.createElement('li');
                cLi.textContent = elem3.definition;
                ul1.append(cLi);
            }
        }
    }
    if (aflag) adio.remove();
}
document.getElementById('history').addEventListener('click', () => {
    if (flag) {
        document.getElementById('searchPage').style.display = 'none';
        document.getElementById('cards').style.display = 'grid';
        document.getElementById('history').textContent = 'SEARCH';
        showHistory();
        flag = false
    }
    else {
        document.getElementById('cards').style.display = 'none';
        document.getElementById('searchPage').style.display = 'block';
        document.getElementById('history').textContent = 'HISTORY';
        flag = true;
    }
});
function showHistory() {
    const pNode = document.getElementById('cards');
    pNode.style.display = 'grid';
    pNode.innerHTML = '';
    for (const elem in localStorage) {
        if (typeof localStorage[elem] != 'function' && typeof localStorage[elem] != 'number' && isJsonString(localStorage[elem])) {
            const data = JSON.parse(localStorage[elem]);
            if (data[0].word != undefined) showHistory1(data);
        }
    }
}
function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
function showHistory1(data) {
    const pNode = document.getElementById('cards');
    const pNode2 = document.createElement('div');
    pNode2.className = 'more card';
    const ch1 = document.createElement('h1');
    ch1.textContent = data[0].word;
    const cNodeDiv = document.createElement('div');
    cNodeDiv.textContent = data[0].meanings[data[0].meanings.length - 1].definitions[0].definition;
    const cNodeButton = document.createElement('button');
    cNodeButton.textContent = "Show More";
    cNodeButton.dataset.data = JSON.stringify(data);
    cNodeButton.setAttribute('onclick', `showHistory2(this)`);
    const cNodeRmv = document.createElement('button');
    cNodeRmv.textContent = "Remove";
    cNodeRmv.dataset.word = data[0].word;
    cNodeRmv.setAttribute('onclick', `removeFunc(this)`);
    pNode2.append(ch1, cNodeDiv, cNodeButton, cNodeRmv);
    pNode.append(pNode2);
}
function showHistory2(elem) {
    const data = JSON.parse(elem.dataset.data);
    const pNode = document.getElementById('cards');
    pNode.style.display = 'block';
    pNode.innerHTML = '';
    const pNode2 = document.createElement('div');
    pNode2.className = 'more card';
    pNode.append(pNode2);
    const ch1 = document.createElement('h1');
    ch1.textContent = data[0].word;
    const adio = document.createElement('audio');
    adio.src = '';
    adio.setAttribute('controls', true);
    pNode2.append(ch1, adio);
    let i = 1;
    let aflag = true;
    for (const elem1 of data) {
        const pUl = document.createElement('ul');
        const pLi = document.createElement('li');
        pNode2.append(pUl);
        pUl.append(pLi);
        const ch5 = document.createElement('h5');
        ch5.textContent = i++;
        pLi.append(ch5);
        let j = 1
        if (elem1.phonetics.length != 0) {
            for (const elem2 of elem1.phonetics) {
                if (elem2.audio != '') {
                    adio.src = elem2.audio;
                    aflag = false;
                    break;
                }
            }
        }
        if (adio.src == '') adio.remove();
        for (const elem2 of elem1.meanings) {
            const ul1 = document.createElement('ul');
            const h4 = document.createElement('h4')
            h4.textContent = elem2.partOfSpeech;
            ul1.append(h4);
            pLi.append(ul1);
            if (elem2.synonyms.length != 0) {
                const div1 = document.createElement('div');
                div1.className = 'sydiv1';
                ul1.append(div1);
                const div2 = document.createElement('div');
                div2.className = 'synow';
                div2.textContent = 'Synonyms- ';
                div1.append(div2);
                for (const elem3 of elem2.synonyms) {
                    const div3 = document.createElement('div');
                    div3.textContent = elem3 + ',';
                    div1.append(div3);
                }
            }
            if (elem2.antonyms.length != 0) {
                const div1 = document.createElement('div');
                div1.className = 'sydiv1';
                ul1.append(div1);
                const div2 = document.createElement('div');
                div2.className = 'synow';
                div2.textContent = 'Antonyms- ';
                div1.append(div2);
                for (const elem3 of elem2.antonyms) {
                    const div3 = document.createElement('div');
                    div3.textContent = elem3 + ',';
                    div1.append(div3);
                }
            }
            for (const elem3 of elem2.definitions) {
                const cLi = document.createElement('li');
                cLi.textContent = elem3.definition;
                ul1.append(cLi);
            }
        }

    }
    if (aflag) adio.remove();
    const backBtn = document.createElement('button');
    backBtn.textContent = "Back";
    backBtn.setAttribute('onclick', `showHistory()`);
    pNode2.append(backBtn);
}
function removeFunc(elem) {
    localStorage.removeItem(elem.dataset.word);
    showHistory();
}
