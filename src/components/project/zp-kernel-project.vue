<template>
    <b-overlay
        :show="loading"
        class="d-inline-block"
        rounded
        opacity="0.5"
        spinner-small
        spinner-variant="primary"
    >
        <b-button
            :variant="kernel ? 'primary' : 'secondary'"
            @click="changeStatus"
        >
            <b-icon icon="check-circle" v-if="kernel" class="mr-2"></b-icon>
            <b-icon icon="circle" v-if="!kernel" class="mr-2"></b-icon>
            Ядерный проект
        </b-button>
    </b-overlay>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'ZPKernelProject',
    props: {
        projectId: Number,
        kernel: Boolean,
    },
    data () {
        return {
            loading: false,
        }
    },
    computed: {
        ...mapState({
            // user: state => state.user,
            // project: state => state.project.project,
            learning_src: state => state.api.learning_src,
        }),
    },
    methods: {
        changeStatus () {
            this.loading = true;
            this.$axios.post(this.learning_src + 'passport/' + this.projectId + '/make_kernel/', {
                project: this.projectId,
                kernel: !this.kernel,
            }).then(data => {
                console.log(data);
                if (data.status == 200) {
                    this.$emit('update', data.data.kernel);
                }
                this.loading = false;
            });
        },
    },
}
</script>
