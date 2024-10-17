<template>
    <q-table :rows="rows" :columns="columns" row-key="id">
        <template v-slot:header-cell-acoes="props">
            <q-th :props="props">Ações</q-th>
        </template>
        <template v-slot:top>
            <span class="text-h5">{{ type }} <span class="text-h6" style="color: rgb(167, 167, 167);">({{
                rows.length
            }})</span></span>
            <q-space />
            <q-btn class="text-white" no-caps :disable="loading" label="Cadastrar" :to="{ name: formCad }"
                style="background-color: #26335d; width: 120px" />
        </template>

        <template v-slot:body-cell-acoes="props">
            <q-td :props="props">
                <q-btn style="margin-right: 5px;" icon="edit" color="primary" dense :to="getEditRoute(props.row)">
                </q-btn>
                <q-btn v-if=DeleteButton(props.row) icon="delete" color="negative" dense @click=DeleteClick(props.row)>
                </q-btn>
            </q-td>
        </template>



        <!-- CONSULTA TEMPLATE ------------------------------------------------------------------------------->
        <template v-if="type === 'Consultas'" v-slot:body-cell-status="props">
            <q-td :props="props">
                <q-badge :color="getStatusBadgeColor(props.row.Status)">{{ props.row.Status }}</q-badge>
            </q-td>
        </template>
        <!-- ------------------------------------------------------------------------------------------ -->
    </q-table>
</template>
  
<script>
export default {
    props: {
        rows: Array,
        columns: Array,
        getSexoBadgeColor: Function,
        getStatusBadgeColor: Function,
        confirm: Function,
        type: String,
        formCad: String,
        formEdit: String,
        params: Object
    },

    methods: {
        getEditRoute(row) {
            let params;
            if (this.type === 'Animais') {
                params = { idCliente: row.clienteId, idAnimal: row.animalId };
            } else if (this.type === 'Consultas') {
                params = { id: row.IdConsulta };
            }
            return {
                name: this.formEdit,
                params,
            };
        },

        DeleteButton(row) {
            if (this.type === 'Animais') {
                return row.ativo !== false;
            } else if (this.type === 'Consultas') {
                return row.Status != 'Cancelada';
            }
        },

        DeleteClick(row) {
            if (this.type === 'Animais') {
                this.confirm(row.animalId);
            } else if (this.type === 'Consultas') {
                this.confirm(row.IdConsulta);
            }
        },
    },
};
</script>
  