<script lang="ts">
</script>

<style lang="scss">
    @import 'styles/vars';

    .popup {
        display: flex;
        flex-direction: column;
        align-items: center;

        position: absolute;
        width: 50vw;
        height: 50vh;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        background: rgba($color: #000000, $alpha: 0.7);

        h1 {
            color: $title;
        }

        div {
            display: flex;
        }
    }
</style>
