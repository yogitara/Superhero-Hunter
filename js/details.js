let image = document.getElementById("superhero-image");
let nameP = document.getElementById("superhero-name");
let descriptionP = document.getElementById("superhero-description");
let comicsP = document.getElementById("superhero-comics");
let seriesP = document.getElementById("superhero-series");
let storiesP = document.getElementById("superhero-stories");
let data = document.getElementById("super-hero-data");
let favBtn = document.getElementById("add-to-fav-btn");

window.addEventListener("load", windowLoaded);
favBtn.addEventListener('click', addRemoveFavourite);

function windowLoaded() {
	let superhero = JSON.parse(window.localStorage.getItem("superhero-details"))

	data.innerText = JSON.stringify(superhero)

	image.src = superhero.thumbnail.path + '.' + superhero.thumbnail.extension
	nameP.innerText = superhero.name
	
	let description = (superhero.description.length == 0) ? "Description not available" : superhero.description
	descriptionP.innerText = description

	let comics = superhero.comics.items
	let displayComics = ""
	for (var i=0; i<comics.length; ++i) {
		displayComics += comics[i].name + "\n"
	}
	comicsP.innerText = displayComics


	let series = superhero.series.items
	let displaySeries = ""
	for (var i=0; i<series.length; ++i) {
		displaySeries += series[i].name + "\n"
	}
	seriesP.innerText = displaySeries


	let stories = superhero.stories.items
	let displayStories = ""
	for (var i=0; i<stories.length; ++i) {
		displayStories += stories[i].name + "\n"
	}
	storiesP.innerText = displayStories
	
	let isFav = isSuperheroFavourite(superhero.id)
	favBtn.innerText = (isFav ? "Remove from " : "Add to ") + "Favourite"
}