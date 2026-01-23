/**
 * Rezept Zufallsgenerator
 * Autor: Dein GitHub-Name
 * Lizenz: MIT
 */
const themeToggle = document.getElementById("themeToggle");

// Dark Mode aus LocalStorage laden
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️ Light Mode";
}

// Standardrezepte
const defaultRecipes = {
    warm: [
        { name: "Spaghetti Bolognese", ingredients: ["Tomaten", "Hackfleisch", "Zwiebeln"] },
        { name: "Kartoffelsuppe", ingredients: ["Kartoffeln", "Karotten", "Lauch"] }
    ],
    snack: [
        { name: "Popcorn", ingredients: ["Mais", "Öl", "Salz"] },
        { name: "Obstsalat", ingredients: ["Äpfel", "Bananen", "Trauben"] }
    ],
    outdoor: [
        { name: "Grillwürstchen", ingredients: ["Würstchen", "Brötchen", "Senf"] },
        { name: "Sandwich", ingredients: ["Brot", "Käse", "Salat"] }
    ]
};

// Rezepte laden oder Standard verwenden
const recipes = JSON.parse(localStorage.getItem("recipes")) ||
    JSON.parse(JSON.stringify(defaultRecipes));

// DOM-Elemente
const recipeInput = document.getElementById("recipeInput");
const ingredientsInput = document.getElementById("ingredientsInput");
const categorySelect = document.getElementById("category");
const randomCategorySelect = document.getElementById("randomCategory");
const resultDiv = document.getElementById("result");

// Events
document.getElementById("addRecipeBtn").addEventListener("click", addRecipe);
document.getElementById("randomBtn").addEventListener("click", randomRecipe);

// Funktionen
function addRecipe() {
    const name = recipeInput.value.trim();
    const ingredients = ingredientsInput.value
        .split(",")
        .map(i => i.trim())
        .filter(Boolean);

    if (!name) {
        alert("Bitte einen Rezeptnamen eingeben!");
        return;
    }

    recipes[categorySelect.value].push({ name, ingredients });
    saveRecipes();
    updateRecipeList();

    recipeInput.value = "";
    ingredientsInput.value = "";
}

function randomRecipe() {
    const list = recipes[randomCategorySelect.value];
    if (list.length === 0) {
        resultDiv.textContent = "Keine Rezepte vorhanden!";
        return;
    }

    const recipe = list[Math.floor(Math.random() * list.length)];
    const ingredientsText = recipe.ingredients.length
        ? ` (Zutaten: ${recipe.ingredients.join(", ")})`
        : "";

    resultDiv.textContent = `🍽 ${recipe.name}${ingredientsText}`;
}

function deleteRecipe(category, index) {
    recipes[category].splice(index, 1);
    saveRecipes();
    updateRecipeList();
}

function updateRecipeList() {
    ["warm", "snack", "outdoor"].forEach(category => {
        const listElement = document.getElementById(`${category}List`);
        listElement.innerHTML = recipes[category]
            .map((r, i) => `
                <li>
                    ${r.name}
                    <button class="delete-btn"
                        onclick="deleteRecipe('${category}', ${i})">
                        Löschen
                    </button>
                </li>
            `)
            .join("");
    });
}

function saveRecipes() {
    localStorage.setItem("recipes", JSON.stringify(recipes));
}

// Initialisierung
updateRecipeList();
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
});
