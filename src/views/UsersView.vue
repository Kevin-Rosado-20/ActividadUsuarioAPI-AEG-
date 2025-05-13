<template>
    <div class="usuarios">
        <div class="usuarios-panel">

            <ButtonPrime label="Nuevo" @click="nuevoUsuario()" />

            <DialogModal v-model:visible="activarModalNuevo" maximizable modal header="Nuevo/Actualizar Usuario"
                :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">

                <div>
                    <InputText class="w-full mb-2" type="text" v-model="usuario.cedula" placeholder="Digite cédula" />
                    <InputText class="w-full mb-2" type="text" v-model="usuario.nombre" placeholder="Digite Nombre" />
                    <InputText class="w-full mb-2" type="text" v-model="usuario.usuario" placeholder="Digite usuario" />
                    <InputText class="w-full mb-2" type="password" v-model="usuario.clave" placeholder="Digite clave" />
                    <InputText class="w-full mb-2" type="password" v-model="usuario.repetirClave"
                        placeholder="Repita clave" />
                    <InputText class="w-full mb-2" type="text" v-model="usuario.genero" placeholder="Digite genero" />
                    <InputText class="w-full mb-2" type="text" v-model="usuario.programa"
                        placeholder="Digite programa" />
                    <ButtonPrime @click="guardarOActualizarUsuario()" label="Guardar" severity="success">
                        {{ accion }}
                    </ButtonPrime>
                </div>

            </DialogModal>

            <ConfirmDialog></ConfirmDialog>

            <DataTable :value="usuarios" tableStyle="min-width: 50rem">
                <ColumnPrime field="cedula" header="N° Documento"></ColumnPrime>
                <ColumnPrime field="nombre" header="Nombre"></ColumnPrime>
                <ColumnPrime field="usuario" header="Usuario"></ColumnPrime>
                <ColumnPrime field="programa" header="Inscrito ha:"></ColumnPrime>
                <ColumnPrime header="Acción:">
                    <template #body="slotProps">
                        <ButtonPrime @click="ver(slotProps.data)" label="Editar" severity="success"
                            class="p-button-success" />
                        <ButtonPrime label="Eliminar" severity="danger"
                            class="p-button-danger ml-2" @click="mostrarConfirmacion(slotProps.data)" />
                    </template>
                </ColumnPrime>
            </DataTable>
        </div>
        
    </div>
</template>

<script>
export default {
    data() {
        return {
            usuarios: [],
            usuario: {
                cedula: 0,
                nombre: "",
                usuario: "",
                clave: "",
                repetirClave: "",
                genero: "",
                programa: ""
            },
            activarModalNuevo: false,
            accion: "Guardar",
            usuarioSeleccionado: null,
        }
    },

    methods: {
        getAllUsuarios: async function () {
            let url = "https://cobuses.com.co/APIV2/model/usuarios.php?dato=getallusuarios";
            let vue = this;
            await this.axios.get(url)
                .then(function (response) {
                    vue.usuarios = response.data;
                })
                .catch(function (error) {
                    console.log(error);

                });
        },

        guardarOActualizarUsuario: async function () {
            let datosEnviar = {
                cedula: this.usuario.cedula,
                nombre: this.usuario.nombre,
                usuario: this.usuario.usuario,
                clave: this.usuario.clave,
                genero: this.usuario.genero,
                programa: this.usuario.programa
            };

            let url = "";
            let mensaje = "";

            if (this.accion === "Guardar") {
                url = "https://cobuses.com.co/APIV2/model/usuarios.php?dato=insertusuario";
                mensaje = "Usuario Guardado Exitosamente";
            } else {
                url = "https://cobuses.com.co/APIV2/model/usuarios.php?dato=updateusuario";
                mensaje = "Usuario Actualizado Exitosamente";
            }

            let vue = this;
            await this.axios.post(url, JSON.stringify(datosEnviar))
                .then(function (response) {
                    if (response.status == 200) {
                        alert(mensaje);

                        if (vue.accion === "Actualizar") {
                            const index = vue.usuarios.findIndex(u => u.cedula === vue.usuario.cedula);
                            if (index !== -1) {
                                vue.usuarios[index] = { ...vue.usuario };
                            }
                        } else {
                            vue.usuarios.push({ ...vue.usuario });
                        }

                        vue.activarModalNuevo = false;
                        vue.usuario = {
                            cedula: 0,
                            nombre: "",
                            usuario: "",
                            clave: "",
                            repetirClave: "",
                            genero: "",
                            programa: ""
                        };

                    }
                })
                .catch(function (error) {
                    console.log(error);

                });
        },

        ver: function (usuario) {
            this.activarModalNuevo = true;
            this.accion = "Actualizar";
            this.usuario = {
                cedula: usuario.cedula,
                nombre: usuario.nombre,
                usuario: usuario.usuario,
                clave: "",
                repetirClave: "",
                genero: usuario.genero,
                programa: usuario.programa
            };
        },
        
        nuevoUsuario: function () {
            this.activarModalNuevo = true;
            this.accion = "Guardar";
            this.usuario = {
                cedula: 0,
                nombre: "",
                usuario: "",
                clave: "",
                repetirClave: "",
                genero: "",
                programa: ""
            };
        },

        mostrarConfirmacion(usuario) {
            this.usuarioSeleccionado = usuario;
            this.$confirm.require({
                message: '¿Esta seguro de eliminar este usuario?',
                header: 'Confirmación',
                acceptLabel: 'Sí',
                rejectLabel: 'No',
                accept: () => {
                    this.borrarUsuario(usuario);  
                },
                reject: () => {
                    
                }
            });
        },

        borrarUsuario: async function (usuario) {
            let url = `https://cobuses.com.co/APIV2/model/usuarios.php?dato=deleteusuario&cedula=${usuario.cedula}`;
            let vue = this;
            await this.axios.get(url)
                .then(function (response) {
                    if (response.status === 200) {
                        alert("Usuario Eliminado Exitosamente");
                        vue.usuarios = vue.usuarios.filter(u => u.cedula !== usuario.cedula);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    },

    created: function () {
        this.getAllUsuarios();
    }
}
</script>

<style scoped>
.usuarios {
    background-color: #F4F4F4;
}

.usuarios-panel {
    width: 70%;
    margin: 0 auto;
    text-align: center;
}

.p-button {
    font-size: 0.75rem;
    padding: 0.5rem 1rem;
    border-radius: 4px;
}

.p-button-success {
    background-color: #4CAF50;
    border-color: #4CAF50;
    height: 30px;
    min-width: 80px;
}

.p-button-success:hover {
    background-color: #45a049;
}

.p-button-danger {
    background-color: #f44336;
    border-color: #f44336;
    height: 30px;
    min-width: 80px;
}

.p-button-danger:hover {
    background-color: #e53935;
}

.ml-2 {
    margin-left: 0.25rem;
}

.p-button-icon {
    margin-right: 0.5rem;
}

.p-button-success,
.p-button-danger {
    display: inline-block;
    vertical-align: middle;
}
</style>
