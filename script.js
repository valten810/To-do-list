const input = document.getElementById("input")
const boton = document.getElementById("agregar")
const lista = document.getElementById("lista-tareas")
const emptyState = document.getElementById("empty-state")

let tareas = []
const guardadas = localStorage.getItem("tareas")
if (guardadas) {
    tareas = JSON.parse(guardadas)
    tareas.forEach(tarea => {
        crearTarea(tarea.texto, tarea.completada, tarea.id)
    });
}
updateTaskList()

boton.addEventListener("click", () => {
    const texto = input.value.trim()
    if (texto === "")
        return
    
    const id = Date.now().toString()
    tareas.push({ texto, completada: false, id })
    guardarTareas()
    
    crearTarea(texto, false, id)

    input.value = ""
    input.focus()
    updateTaskList()
})

function crearTarea(texto, completed = false, id = null) {
    const li = document.createElement("li")
    li.dataset.id = id
    li.draggable = true
    li.classList.add("task-item")

    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.classList.add("checkbox")
    if (completed) {
        checkbox.checked = true
        li.classList.add("completed")
    }

    checkbox.addEventListener("change", () => {
        li.classList.toggle("completed");
        const tarea = tareas.find(t => String(t.id) === String(li.dataset.id))
        if (tarea) {
            tarea.completada = checkbox.checked
            guardarTareas()
        }
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
        tareas = tareas.filter(t => String(t.id) !== String(li.dataset.id))
        guardarTareas()
    })
    
    // Drag events on the item
    li.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', li.dataset.id)
        li.classList.add('dragging')
    })
    li.addEventListener('dragend', () => {
        li.classList.remove('dragging')
    })

    li.appendChild(checkbox)
    li.appendChild(span)
    li.appendChild(btnEliminar)
    lista.appendChild(li)

    input.value = "";
    input.focus();

    updateTaskList()
}

// Helpers to handle dragging over the list
lista.addEventListener('dragover', e => {
    e.preventDefault()
    const afterElement = getDragAfterElement(lista, e.clientY)
    const dragging = document.querySelector('.dragging')
    if (!dragging) return
    if (afterElement == null) {
        lista.appendChild(dragging)
    } else {
        lista.insertBefore(dragging, afterElement)
    }
})

lista.addEventListener('drop', e => {
    e.preventDefault()
    // rebuild tareas order from DOM order
    const newOrderIds = Array.from(lista.children).map(li => li.dataset.id)
    tareas = newOrderIds.map(id => tareas.find(t => String(t.id) === String(id))).filter(Boolean)
    guardarTareas()
    updateTaskList()
})

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('li.task-item:not(.dragging)')]
    let closest = { offset: Number.NEGATIVE_INFINITY, element: null }

    for (const child of draggableElements) {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2
        if (offset < 0 && offset > closest.offset) {
            closest = { offset, element: child }
        }
    }
    return closest.element
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