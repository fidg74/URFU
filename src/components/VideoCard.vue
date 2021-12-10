<template>
    <div>
        <b-card
            class="std-card video-card"
            no-body
            :class="{'minified': videoCardMinified}"
        >
            <b-card-body class="maxi-body">
                <div class="video-thumbnail" @click="showVideo">
                    <img :src="thumbnailSrc">
                </div>
                <slot name="header"></slot>
                <p>В этом коротком <a href="#" @click.prevent="showVideo">2-минутном видео</a> мы рассказываем об особенностях и задачах данного сервиса</p>
                <a v-if="showHideButton" class="minify-btn" @click.prevent="toggleVideoCard">Свернуть</a>
            </b-card-body>
            <b-card-body class="mini-body open">
                <a class="view-video" href="#" @click.prevent="toggleVideoCard">
                    <i>
                        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M0.92622 16.7378C1.43776 16.7378 1.85244 17.1525 1.85244 17.6641V24.1476H8.33598C8.84752 24.1476 9.2622 24.5623 9.2622 25.0738C9.2622 25.5854 8.84752 26 8.33598 26H0.92622C0.414683 26 1.38018e-08 25.5854 1.38018e-08 25.0738V17.6641C1.38018e-08 17.1525 0.414683 16.7378 0.92622 16.7378Z" fill="#111112"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.91714 16.0171C10.2789 16.3788 10.2789 16.9652 9.91714 17.3269L1.58116 25.6629C1.21945 26.0246 0.632995 26.0246 0.271284 25.6629C-0.0904279 25.3012 -0.0904279 24.7148 0.271284 24.3531L8.60727 16.0171C8.96898 15.6554 9.55543 15.6554 9.91714 16.0171Z" fill="#111112"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M25.6627 0.271284C26.0245 0.632995 26.0245 1.21945 25.6627 1.58116L17.3268 9.91714C16.9651 10.2789 16.3786 10.2789 16.0169 9.91714C15.6552 9.55543 15.6552 8.96898 16.0169 8.60727L24.3529 0.271284C24.7146 -0.0904279 25.301 -0.0904279 25.6627 0.271284Z" fill="#111112"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.7377 0.92622C16.7377 0.414683 17.1523 1.38018e-08 17.6639 1.38018e-08H25.0736C25.5852 1.38018e-08 25.9999 0.414683 25.9999 0.92622V8.33598C25.9999 8.84752 25.5852 9.2622 25.0736 9.2622C24.5621 9.2622 24.1474 8.84752 24.1474 8.33598V1.85244H17.6639C17.1523 1.85244 16.7377 1.43776 16.7377 0.92622Z" fill="#111112"/>
                        </svg>
                    </i>
                    Показать видео-приветствие
                </a>
            </b-card-body>
        </b-card>
        <b-modal :id="modalId" size="xl" hide-footer :title="modalTitle">
            <iframe width="100%" :src="videoSrc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </b-modal>
    </div>
</template>

<script>
import { setCookie, getCookie, makeUID } from '@/utils';

export default {
    name: 'VideoCard',
    components: {
    },
    props: {
        thumbnailSrc: String,
        videoSrc: String,
        videoCookieName: String,
        modalTitle: String,
        showHideButton: Boolean,
        uid: String,
    },
    data () {
        return {
            videoCardMinified: false,
            modalId: String
        }
    },
    created () {
        this.modalId = 'videoCardModal' + makeUID(3)
        
        const videoHiddenCookie = getCookie(this.videoCookieName)
        if (videoHiddenCookie === 'true') {
            this.videoCardMinified = true
        }
    },
    methods: {
        toggleVideoCard () {
            this.videoCardMinified = !this.videoCardMinified;
            setCookie(this.videoCookieName, this.videoCardMinified)
        },
        showVideo () {
            this.$bvModal.show(this.modalId);
        },
    },
}
</script>
<style>
.video-card .video-thumbnail {
    position: relative;
    cursor: pointer;
    margin-bottom: 30px;
}
.video-card .video-thumbnail > img {
    width: 100%;
    border-radius: 6px;
    opacity: .9;
    transition: .3s;
}
.video-card .video-thumbnail:hover > img {
    opacity: 1;
}
.video-card .video-thumbnail:after {
    display: block;
    position: absolute;
    content: "";
    width: 66px;
    height: 56px;
    background: center url(/learning/static/img/video-play.svg) no-repeat;
    background-size: contain;
    top: 50%;
    left: 50%;
    margin-top: -28px;
    margin-left: -33px;
    opacity: .75;
    transition: .3s;
}
.video-card .video-thumbnail:hover:after {
    opacity: 1;
}
.video-card > .mini-body {
    display: none;
}
.video-card.minified > .mini-body {
    display: block;
}
.video-card.minified .video-thumbnail,
.video-card.minified > .maxi-body {
    flex: 0 0 0;
    opacity: 0;
    transform: translateY(0);
    transform-origin: top;
    height: 0;
    padding: 0;
    visibility: hidden;
}
.video-card .video-thumbnail,
.video-card > .maxi-body {
    transition: .3s;
}
iframe {
    height: 80vh;
}

@media (max-width: 575px) {

    .mini-body > a.view-video {
        cursor: pointer;
    display: inline-block;
    font-size: 12px;
    line-height: 30px;
    letter-spacing: -0.2px;
    color: #9DA7B0;
    margin-right: 20px;
    }
    .mini-body > a.view-video i {
        width: 16px;
        min-width: 16px;
        margin-right: 10px;
        position: relative;
        top: 2px;
        height: 16px;
        background: transparent;
    }
    .min-body.open {
        padding: 0;
    }
    .mini-body > a.view-video i svg {
        width: 16px;
        height: 16px;
    }
}
</style>