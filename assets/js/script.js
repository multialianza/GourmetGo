//========================================================
//Gourmet Go - Sprint 2                 ==================
//========================================================

// ====== SELECTORES DOM ======
const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const container = document.getElementById("recipeContainer");
const loader = document.getElementById("loader");

// Modal
const modal = new bootstrap.Modal("#recipeModal");
const modalTitle = document.getElementById("modalTitle");
const modalImage = document.getElementById("modalImage");
const modalInstructions = document.getElementById("modalInstructions");
const ingredientList = document.getElementById("ingredientList");

// ===== CLASE RECETA  (POO - opcional recomendado)  =====
class Receta {
    constructor({ idMeal, strMeal, strMealThumb }) {
        this.id = idMeal;
        this.nombre = strMeal;
        this.imagen = strMealThumb;
    }
}

// ===== UTILIDADES =====
const mostrarLoader = () => loader.classList.remove("d-none");
const ocultarLoader = () => loader.classList.add("d-none");
const limpiarResultados = () => container.innerHTML = "";

// ===== RENDER TARJETAS =====
const renderizarRecetas = (recetas) => {
    limpiarResultados();

    recetas.forEach(({ id, nombre, imagen }) => {
        container.innerHTML += `
            <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
                <div class="card shadow">
                    <img src="${imagen}" class="card-img-top" alt="${nombre}">
                    <div class="card-body">
                        <h5 class="card-title">${nombre}</h5>
                        <button class="btn btn-primary btn-ver-receta" data-id="${id}">
                            Ver receta
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
};

// ===== MENSAJE SIN RESULTADOS =====
const mostrarMensajeSinResultados = () => {
    limpiarResultados();
    container.innerHTML = `
        <p class="no-results">
            No se encontraron recetas. Intenta con otro ingrediente.
        </p>
    `;
};

// ===== BUSCAR RECETAS =====
const buscarRecetas = async (ingrediente) => {
    mostrarLoader();

    try {
        const res = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingrediente}`
        );
        const data = await res.json();

        ocultarLoader();

        if (!data.meals) {
            mostrarMensajeSinResultados();
            return;
        }

        const recetas = data.meals.map(meal => new Receta(meal));
        renderizarRecetas(recetas);

    } catch (error) {
        ocultarLoader();
        console.error(error);
    }
};

// ===== BUSCAR DETALLE =====
const buscarRecetaPorId = async (id) => {
    mostrarLoader();

    try {
        const res = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        const data = await res.json();

        ocultarLoader();
        renderizarDetalle(data.meals[0]);

    } catch (error) {
        ocultarLoader();
        console.error(error);
    }
};

// ===== RENDER DETALLE MODAL =====
const renderizarDetalle = (receta) => {
    const {
        strMeal,
        strMealThumb,
        strInstructions
    } = receta;

    modalTitle.textContent = strMeal;
    modalImage.src = strMealThumb;
    modalInstructions.textContent = strInstructions;

    // Ingredientes dinámicos
    ingredientList.innerHTML = "";

    for (let i = 1; i <= 20; i++) {
        const ingrediente = receta[`strIngredient${i}`];
        const medida = receta[`strMeasure${i}`];

        if (ingrediente && ingrediente.trim() !== "") {
            ingredientList.innerHTML += `
                <li>${ingrediente} - ${medida}</li>
            `;
        }
    }

    modal.show();
};

// ===== EVENTOS =====
form.addEventListener("submit", (e) => {
    e.preventDefault();
    buscarRecetas(input.value.trim().toLowerCase());
});

container.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-ver-receta")) {
        buscarRecetaPorId(e.target.dataset.id);
    }
});
