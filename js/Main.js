let wBox = $('.nav-tab').innerWidth();
let rowData = document.getElementById('rowData');
let modal_body = document.getElementById("modal_body");
let searchContainer = document.getElementById("searchContainer");
var Meals = [];


$(window).ready(function () {
  /////////////////////////////////Spinner [I have Chosen another Spinner] \\\\\\\\\\\\\\\\\\\\\\\\\
  $('.lds-facebook').fadeOut(1100, () => {
    $('#loading').fadeOut(600)
  });

  // $('.fa-spinner').fadeOut(1100, () => {
  //   $('#loading').fadeOut(500)
  // });
  /////////////////////////////////Show/Hide Side Bar Menu \\\\\\\\\\\\\\\\\\\\\\\\\
  $('.nav-header i.open-close-icon').on('click', function () {
    if ($('#sideBar').css('left') == '0px') {
      HideSideBar()
    }
    else {
      ShowSideBar()
    }
  })
  /////////////////////////////////Toggle Dark / Light  Modes \\\\\\\\\\\\\\\\\\\\\\\\\
  const checkbox = document.getElementById("checkbox")
  checkbox.addEventListener("change", () => {
    document.body.classList.toggle("light")
  })
})
///////////////////////////////// \\\\\\\\\\\\\\\\\\\\\\\\\
/// Show Side Bar Menu
function ShowSideBar() {
  $('#sideBar').animate({ left: `0px` }, 600)
  $(".open-close-icon").addClass('fa-solid fa-x');
  for (let i = 0; i < 5; i++) {
    $(".links ul li").eq(i).animate({
      top: 0
    }, (i + 5) * 100)
  }
}
/// Hide Side Bar Menu
function HideSideBar() {
  $('#sideBar').animate({ left: `-${wBox}px` }, 500)
  $(".open-close-icon").removeClass('fa-solid fa-x');
  $(".open-close-icon").addClass('fa-solid open-close-icon fa-2x fa-align-justify');

  for (let i = 0; i < 5; i++) {
    $(".links ul li").eq(i).animate({
      top: 200
    }, (i + 5) * 100)
  }
}
// -------------------------------Show Meals on Load Screan--------------------------
async function SearchAllMeals(mealName, status = "showMeals") {
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`)
  // let response =await fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
  // console.log(response.categories);
  response = await response.json()
  Meals = response.meals;
  if (status == 'search') {
    ShowAllMeals(Meals ? Meals.slice(0, 20) : "")
  }
  else if (status == 'showMeals') {
    searchContainer.innerHTML = '';
    ShowAllMeals(Meals ? Meals.slice(0, 20) : "")

  }
}

SearchAllMeals("")

function ShowAllMeals(Meals) {
  let cortona = "";
  if (Meals != []) {
    for (let i = 0; i < Meals.length; i++) {
      cortona += `<div onclick=ShowMeal_Details(${Meals[i].idMeal}) class="col-md-3">
        <div class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
          <img class="w-100" src="${Meals[i].strMealThumb}" alt="">
          <div class="meal-layer  position-absolute d-flex align-items-center text-black p-2"><h3>${Meals[i].strMeal}</h3></div>
        </div>
      </div>`
    }

  }
  else {
    cortona = ''
  }
  rowData.innerHTML = cortona;
  // console.log(rowData);
}
// -------------------------------Show Meal Details on Modal--------------------------
$('button[name="CloseModal"]').on('click', function (params) {
  $("#exampleModal").modal("hide")
})
// window.onclick = function (event) {
//   console.log(event.target);
//   if (event.target == modal) {
//     $("#exampleModal").modal("hide")
//   }
// }
/**************************-------------------************************ */
async function ShowMeal_Details(mealID) {
  $("#exampleModal").modal("show")
  let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
  respone = await respone.json();
  displayMealDetails(respone.meals[0])
}
/**************************-------------------************************ */
function displayMealDetails(meal) {
  // console.log(meal);
  let ingredients = ``
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
    }
  }

  let tagsDiv = ''
  let tagsText = meal.strTags ? meal.strTags.split(",") : "No Tags".split(",")
  if (!tagsText) tagsText = []
  for (let i = 0; i < tagsText.length; i++) {
    tagsDiv += `<li class="alert alert-danger m-2 p-1">${tagsText[i]}</li>`
  }

  let cartoona = `
  <div class="col-md-4">
              <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="">
              <h2>${meal.strMeal}</h2>
  </div>
          <div class="col-md-8">
              <h2>Instructions</h2>
              <p>${meal.strInstructions}</p>
              <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
              <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
              <h3>Recipes :</h3>
              <ul class="list-unstyled d-flex g-3 flex-wrap">
                  ${ingredients}
              </ul>

              <h3>Tags :</h3>
              <ul class="list-unstyled d-flex g-3 flex-wrap">
                  ${tagsDiv}
              </ul>

              <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
              <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
          </div>`

  modal_body.innerHTML = cartoona
}
// -------------------------------Show-Search By Name-Results------------------------
function showSearchInputs() {
  rowData.innerHTML = "";
  HideSideBar();
  searchContainer.innerHTML = `
  <div class="row py-4 ">
      <div class="col-md-6 ">
          <input type="text" oninput="SearchBy_Name(this.value)" class="form-control bg-transparent text-white" placeholder="Search By Name">
      </div>
      <div class="col-md-6">
          <input type="text" oninput="searchBy_Letter(this.value)" maxlength="1" class="form-control bg-transparent text-white" placeholder="Search By First Letter">
      </div>
  </div>`

}

async function SearchBy_Name(MealName_input) {
  await SearchAllMeals(MealName_input, "search")
}


////////////////////////////////// search_By_Letter \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
async function searchBy_Letter(MealLetter_input) {
  HideSideBar()
  $('#loading').fadeOut(600)
  rowData.innerHTML = ""
  MealLetter_input == "" ? MealLetter_input = "a" : "";
  // MealLetter_input = MealLetter_input != "" ? MealLetter_input : "a"
  console.log(MealLetter_input);
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${MealLetter_input}`)
  response = await response.json()
  Meals = response.meals;
  Meals = Meals ? Meals.slice(0, 20) : ""
  ShowAllMeals(Meals ? Meals.slice(0, 20) : "")
}
//////////////////////////////////////////// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
async function getCategories() {
  HideSideBar()
  $('#loading').fadeOut(600)
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
  response = await response.json()
  Meals = response.categories;
  Meals = Meals ? Meals.slice(0, 20) : ""
  ShowAllMeals_Cateory(Meals ? Meals.slice(0, 20) : "")
}

function ShowAllMeals_Cateory(Meals) {
  let cortona = "";
  // console.log(Meals);
  if (Meals != []) {
    for (let i = 0; i < Meals.length; i++) {
      Categ_Desc = Meals[i].strCategoryDescription.split(" ").length <= 10 ? Meals[i].strCategoryDescription
        : Meals[i].strCategoryDescription.split(" ").slice(0, 20).join(" ");
      cortona += `<div onclick=ShowCategory_Details(${Meals[i].idCategory}) class="col-md-3">
        <div class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
          <img class="w-100" src="${Meals[i].strCategoryThumb}" alt="">
          <div class="meal-layer position-absolute text-center text-black p-2">
              <h3>${Meals[i].strCategory}</h3>
              <p>${Categ_Desc}</p>
          </div>
          </div>
          </div>`
    }

  }
  else {
    cortona = ''
  }
  rowData.innerHTML = cortona;
}

async function ShowCategory_Details(category) {
  rowData.innerHTML = ""
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
  response = await response.json()
  console.log(response);
  Meals = response.categories;
  // Meals = Meals ? Meals.slice(0, 20) : ""
  ShowAll_Category_Details(Meals ? Meals.slice(0, 20) : "")

}
function ShowAll_Category_Details(Meals) {
  let cortona = "";
  if (Meals != []) {
    for (let i = 0; i < Meals.length; i++) {
      cortona += `<div onclick=ShowMeal_Details(${Meals[i].idMeal}) class="col-md-3">
        <div class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
          <img class="w-100" src="${Meals[i].strMealThumb}" alt="">
          <div class="meal-layer  position-absolute d-flex align-items-center text-black p-2"><h3>${Meals[i].strMeal}</h3></div>
        </div>
      </div>`
    }

  }
  else {
    cortona = ''
  }
  rowData.innerHTML = cortona;
  // console.log(rowData);
}

//////////////////////////////////////////// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//////////////////////////////////////////// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function showContacts() {
  HideSideBar()

  rowData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
  <div class="container w-75 text-center">
      <div class="row g-4">
          <div class="col-md-6">
              <input id="nameInput" type="text" class="form-control" placeholder="Enter Your Name">
              <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Special characters and numbers not allowed
              </div>
          </div>
          <div class="col-md-6">
              <input id="emailInput" type="email" class="form-control " placeholder="Enter Your Email">
              <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Email not valid *exemple@yyy.zzz
              </div>
          </div>
          <div class="col-md-6">
              <input id="phoneInput" type="text" class="form-control " placeholder="Enter Your Phone">
              <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid Phone Number
              </div>
          </div>
          <div class="col-md-6">
              <input id="ageInput" type="number" class="form-control " placeholder="Enter Your Age">
              <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid age
              </div>
          </div>
          <div class="col-md-6">
              <input  id="passwordInput"  type="password" class="form-control " placeholder="Enter Your Password">
              <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid password *Minimum eight characters, at least one letter and one number:*
              </div>
          </div>
          <div class="col-md-6">
              <input  id="repasswordInput"  type="password" class="form-control " placeholder="Repassword">
              <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid repassword 
              </div>
          </div>
      </div>
      <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
  </div>
</div> `
  
}