const input = document.getElementById("input")
const boton = document.getElementById("agregar")
const lista = document.getElementById("lista-tareas")
const emptyState = document.getElementById("empty-state")

boton.addEventListener("click", () => {
    const texto = input.value.trim()
    if (texto === "")
        return

    const li = document.createElement("li")

    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.classList.add("checkbox")
    

    checkbox.addEventListener("change", () => {
        li.classList.toggle("completed");
    });

    const span = document.createElement("span")
    span.textContent = texto


    const btnEliminar = document.createElement("button")
    btnEliminar.textContent = "🗑️ Eliminar"
    btnEliminar.classList.add("eliminar")
    btnEliminar.addEventListener("click", () => {
        li.style.animation = "fadeLeft 0.2s ease forwards"
        setTimeout(() => {
            li.remove()
            updateTaskList()
        }, 300)
    })
    

    lista.appendChild(li)
    li.appendChild(checkbox)
    li.appendChild(span)
    li.appendChild(btnEliminar)

    input.value = "";
    input.focus();

    updateTaskList()
})

function updateTaskList() {
    const totalTask = lista.children.length
    
    if (totalTask === 0) {
        emptyState.classList.add("show")
    } else {
        emptyState.classList.remove("show")
    }
}
updateTaskList()