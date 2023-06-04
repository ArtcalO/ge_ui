<template>
    <dialog-overlay id="confirm">
        <h3>Voulez-vous vraiment supprimer? C'est action est irreversible!</h3>
        <div class="btn-group">
            <button class="btn btn-danger" @click="$emit('delete', request)">
                Supprimer
            </button>
            <button class="btn" @click="closeModal">Annuler</button>
        </div>
    </dialog-overlay>
</template>

<script>
import dialogOverlay from "./dialogOverlay.vue";

export default {
    components: { dialogOverlay },
    props: ["request"],
};
</script>

<style scoped>
h3 {
    padding: 16px 0;
}
.btn-group {
    display: flex;
    padding-top: 16px;
    border-top: 1px solid var(--color-soft-grey);
    gap: 8px;
}
</style>

