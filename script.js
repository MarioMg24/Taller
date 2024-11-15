import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, onValue, update, remove } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAuTlpLnKheu7cKeYsBv2diq_uIzL4MMNM", // Clave API de tu proyecto de Firebase
  authDomain: "taller-3df83.firebaseapp.com", // Dominio de autenticación de tu proyecto
  projectId: "taller-3df83", // ID del proyecto
  storageBucket: "taller-3df83.firebasestorage.app", // URL del bucket de almacenamiento
  messagingSenderId: "518254665478", // ID del remitente
  appId: "1:518254665478:web:af95f936b11fe5c6ef0887", // ID de la aplicación
  measurementId: "G-3FYZPNLWM0" // ID de medición
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app); // Obtiene la base de datos de Firebase

// Maneja el evento 'submit' del formulario para agregar o actualizar un usuario
document.getElementById('userForm').addEventListener('submit', (e) => {
  e.preventDefault(); // Previene la acción por defecto del formulario
  const nombre = document.getElementById('nombre').value;
  const apellido = document.getElementById('apellido').value;
  const edad = parseInt(document.getElementById('edad').value);
  const direccion = document.getElementById('direccion').value;
  const userId = document.getElementById('userId').value;
 // Si hay un 'userId', actualiza el usuario existente
  if (userId) {
    const userRef = ref(db, 'usuarios/' + userId);
    update(userRef, { nombre, apellido, edad, direccion }).then(() => {
      Swal.fire({ // Muestra una alerta de éxito al actualizar el usuario
        icon: 'success',
        title: 'Usuario actualizado',
        text: 'El usuario ha sido actualizado correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
      // Limpia el formulario y restablece el estado
      document.getElementById('userForm').reset();
      document.getElementById('formTitle').innerText = 'Agregar Usuario';
      document.getElementById('userId').value = '';
    }).catch((error) => {
      Swal.fire({ // Muestra una alerta de error si la actualización falla
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el usuario. Intenta nuevamente.',
      });
    });
  } else {  // Si no hay 'userId', crea un nuevo usuario
    const userRef = ref(db, 'usuarios/');
    push(userRef, { nombre, apellido, edad, direccion }).then(() => {
      Swal.fire({ // Muestra una alerta de éxito al agregar el usuario
        icon: 'success',
        title: 'Usuario agregado',
        text: 'El usuario ha sido agregado correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
    }).catch((error) => {
      Swal.fire({  // Muestra una alerta de error si la adición falla
        icon: 'error',
        title: 'Error',
        text: 'No se pudo agregar el usuario. Intenta nuevamente.',
      });
    });
  }

  e.target.reset(); // Resetea el formulario después de la operación
});
// Escucha los cambios en la referencia de usuarios y actualiza la tabla
const userRef = ref(db, 'usuarios/');
onValue(userRef, (snapshot) => {
  const userTableBody = document.getElementById('userTableBody');
  userTableBody.innerHTML = ''; // Limpia la tabla antes de llenarla con nuevos datos
  snapshot.forEach((childSnapshot) => { 
    const data = childSnapshot.val(); // Obtiene los datos del usuario
    const userId = childSnapshot.key; // Obtiene la clave del usuario
    const row = document.createElement('tr'); // Crea una fila para mostrar al usuario
    row.innerHTML = `
      <td class="py-2 px-4 border-b">${data.nombre}</td>
      <td class="py-2 px-4 border-b">${data.apellido}</td>
      <td class="py-2 px-4 border-b">${data.edad}</td>
      <td class="py-2 px-4 border-b">${data.direccion}</td>
      <td class="py-2 px-4 border-b">
        <div class="flex space-x-2">
          <button class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 flex items-center" onclick="editUser('${userId}')">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-1-1 4-4 1 1-4 4zM7 7l2-2m2 2L7 7m2 2h.01M9 15l6-6M19 19H5V5l7 7m3 3l7 7"/>
            </svg>
            Editar
          </button>
          <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center" onclick="deleteUser('${userId}')">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9 5-9-5-9 5V5l9 5 9-5v10l-9 5z"/>
            </svg>
            Eliminar
          </button>
        </div>
      </td>
    `;
    userTableBody.appendChild(row); // Añade la fila a la tabla
  });
});
// Función para editar un usuario
window.editUser = function(userId) {
  const userRef = ref(db, 'usuarios/' + userId);
  onValue(userRef, (snapshot) => {
    // Rellena los campos del formulario con los datos del usuario
    const data = snapshot.val();
    document.getElementById('nombre').value = data.nombre;
    document.getElementById('apellido').value = data.apellido;
    document.getElementById('edad').value = data.edad;
    document.getElementById('direccion').value = data.direccion;
    document.getElementById('userId').value = userId; // Establece el userId para editar
    document.getElementById('formTitle').innerText = 'Editar Usuario'; // Cambia el título del formulario
  }, { onlyOnce: true });
}
// Función para eliminar un usuario
window.deleteUser = function(userId) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'No podrás revertir esta acción.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      const userRef = ref(db, 'usuarios/' + userId);
      remove(userRef).then(() => {
        Swal.fire({ // Muestra una alerta de éxito al eliminar el usuario
          icon: 'success',
          title: 'Eliminado',
          text: 'El usuario ha sido eliminado correctamente.',
          timer: 2000,
          showConfirmButton: false
        });
      }).catch((error) => {
        Swal.fire({ // Muestra una alerta de error si la eliminación falla
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el usuario. Intenta nuevamente.',
        });
      });
    }
  });
}
