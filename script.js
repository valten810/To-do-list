const input = document.getElementById("input")
const boton = document.getElementById("agregar")
const lista = document.getElementById("lista-tareas")
const emptyState = document.getElementById("empty-state")

let tareas = []
const guardadas = localStorage.getItem("tareas")
if (guardadas) {
    tareas = JSON.parse(guardadas)
    tareas.forEach(tarea => {
        crearTarea(tarea.texto, tarea.completada)
    });
}
updateTaskList()

boton.addEventListener("click", () => {
    const texto = input.value.trim()
    if (texto === "")
        return
    
    tareas.push({ texto, completada: false})
    guardarTareas()
    
    crearTarea(texto)

    input.value = ""
    input.focus
    updateTaskList()
})

function crearTarea(texto, completed = false) {
    const li = document.createElement("li")

    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.classList.add("checkbox")
    if (completed) {
    checkbox.checked = true
    li.classList.add("completed")
}

    checkbox.addEventListener("change", () => {
        li.classList.toggle("completed");
        
        const textoTarea = span.textContent
        const tarea = tareas.find(t => t.texto === textoTarea)
        if (tarea) {
            tarea.completada = checkbox.checked
            guardarTareas()
        }});

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
        tareas = tareas.filter(t => t.texto !== span.textContent)
        guardarTareas()
    })
    

    lista.appendChild(li)
    li.appendChild(checkbox)
    li.appendChild(span)
    li.appendChild(btnEliminar)

    input.value = "";
    input.focus();

    updateTaskList()

}

function updateTaskList() {
    const totalTask = lista.children.length
    
    if (totalTask === 0) {
        emptyState.classList.add("show")
    } else {
        emptyState.classList.remove("show")
    }
}

function guardarTareas() {
    localStorage.setItem("tareas", JSON.stringify(tareas))
}
updateTaskList()