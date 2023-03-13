let searchSuperheroBtn = document.getElementById("search-superhero-btn");
let searchBar = document.getElementById("search-bar");
let superheroList = document.getElementById("superhero-list");
let homeLink = document.getElementById("home-link");
let favLink = document.getElementById("fav-link");
let isHomePage = homeLink.classList.contains("active");
let isFavouritesPage = favLink.classList.contains("active");

window.addEventListener("load", windowLoaded);
searchSuperheroBtn.addEventListener("click", searchSuperheroByName);

function windowLoaded() {
	if (isHomePage) {
		fetchSuperheros('');
	}

	if (isFavouritesPage) {
		displayFavouriteSuperheros();
	}
}

function searchSuperheroByName(element) {
	// To prevent page from reloading after form submit
	element.preventDefault();
	
	// remove all the list item to show new results
	superheroList.innerHTML = "";

	// get search string from searchbar value
	const searchString = searchBar.value;
	fetchSuperheros(searchString)
}

async function fetchSuperheros(searchQuery) {
	var params = {
		ts: 1,
		apikey: '289f70c941ab8e68da1f99fc41c2980a',
		hash: 'f86bec8162c274a74af89ea18eb31201'
	}

	if (searchQuery.length != 0) {
		params['nameStartsWith'] = searchQuery
	}

	const response = await fetch('https://gateway.marvel.com:443/v1/public/characters?' + new URLSearchParams(params))
	const data = await response.json()
	let superheros = data.data.results;
	
	if (superheros.length == 0) {
		alert("No superheros found! Please try another search query!")
	} else {
		displaySuperheros(superheros)
	}
}

function displaySuperheros(superheros) {
	// remove all the list item to show new results
	superheroList.innerHTML = "";

	for (const index in superheros) {
		
		let superhero = superheros[index]
		let isFav = isSuperheroFavourite(superhero.id)
		let description = (superhero.description.length == 0) ? "Description not available" : superhero.description

		const superheroItem = document.createElement("div");
		superheroItem.classList.add("superhero-item");
		superheroItem.innerHTML = `
		<div id="superhero-image">
			<img src="${superhero.thumbnail.path + '.' + superhero.thumbnail.extension}" alt="Superhero thumbnail">
		</div>
		<div id="superhero-detail">
			<p id='superhero-name'>${superhero.name}</p>
			<p id='superhero-description'>${description}</p>
			<p hidden id='super-hero-data'>${JSON.stringify(superhero)}</p>
			<button id='add-to-fav-btn'>${isFav ? "Remove from " : "Add to "} Favourite</button>
		</div>
		`;

		superheroList.prepend(superheroItem);
	}



	let favButtons = document.querySelectorAll("#add-to-fav-btn");
	for (var i=0; i<favButtons.length; ++i) {
		favButtons[i].addEventListener('click', addRemoveFavourite);
	}

	let superheroListItems = document.querySelectorAll("#superhero-image");
	for (var i=0; i<favButtons.length; ++i) {
		superheroListItems[i].addEventListener('click', gotoSuperheroDetails);
	}
}

function gotoSuperheroDetails() {
	window.localStorage.setItem("superhero-details", this.parentElement.children['superhero-detail'].children['super-hero-data'].innerHTML)
	window.open('details.html', '_self')
}

function addRemoveFavourite() {
	let superhero = JSON.parse(this.parentElement.children['super-hero-data'].innerHTML);

	let favSuperheros = getFavSuperheros()

	if (isSuperheroFavourite(superhero.id)) {
		let filteredSuperheros = favSuperheros.filter((item) => item.id !== superhero.id);
		favSuperheros = filteredSuperheros
		this.innerText = "Add to Favourite"
	} else {
		favSuperheros.push(superhero)
		this.innerText = "Remove from Favourite"
	}

	window.localStorage.setItem("favourite-superheros", JSON.stringify(favSuperheros));

	if (isFavouritesPage) {
		displayFavouriteSuperheros();
	}
}

function getFavSuperheros() {
	let favSuperheros = window.localStorage.getItem("favourite-superheros");
	if (favSuperheros == null) {
		return [];
	} else {
		return JSON.parse(window.localStorage.getItem("favourite-superheros"));
	}
}

function isSuperheroFavourite(superheroID) {
	let favSuperheros = getFavSuperheros();
	return favSuperheros.some(function(el) {
		return el.id == superheroID
	})  
}

function displayFavouriteSuperheros() {
	let favSuperheros = getFavSuperheros();
	displaySuperheros(favSuperheros);
}