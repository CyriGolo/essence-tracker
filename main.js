let input = document.querySelector('#cp');
let carbu = document.querySelector('#carbu');
let result = document.querySelector('tbody')


async function getData(fuelName, cp) {
    let fuel = fuelName.toLowerCase();
    let url = encodeURI(`https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records?select=adresse,${fuel}_prix AS prix,id&where=cp like "${cp}" and carburants_disponibles in ("${fuelName}")&limit=-1`)
    let response = await fetch(url);
    let responseAsJson = await response.json();
    classByPrice(responseAsJson);
};

function classByPrice(arr) {
    let tab = arr.results;
    let newArr = [];
    if(tab != 0) {
        for(let i = tab.length; i != 0; i--) {
            let temp = tab[0];
            for(let j = 1;j<tab.length;j++){
                if(parseFloat(tab[j].prix) < parseFloat(temp.prix)){
                    temp = tab[j]
                }
            }
            let index = tab.indexOf(temp)
            tab.splice(index,1)
            newArr.push(temp)
        };
        createData(newArr)
    } else {
        result.innerHTML = `
        <tr>
            <td class="error">Aucun résultat</td>
        </tr>`
    };
}

function createData(data) {
    result.innerHTML = ''; 
    for(let i = 0; i<data.length; i++) {
        result.innerHTML += `
        <tr>
            <td>${data[i].prix}</td>
            <td>
                <p>${data[i].adresse}</p>
                <a href="https://www.google.fr/maps?q=${data[i].adresse}"><iconify-icon icon="mdi:compass-outline" width="1.5em"></iconify-icon></a>
            </td>
        </tr>
        `
    }
}

input.addEventListener('input', ()=>{
    getData(carbu.value, input.value)
})

carbu.addEventListener('change',()=>{
    getData(carbu.value, input.value)
})

getData(carbu.value, input.value);

navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    console.log(position);
});