<template>
    <div class="defalut-png">
        <div class="d-content">
            <div class="title">
                <p class="title-four">404</p>
                <p style="color: #e9f9ff">正在加紧开发！！</p>
                <div style="display: flex">
<!--                    <div  class="btn-link" @click="$router.push('/home')">首页</div>-->
                    <div class="btn-link"  @click="$router.history.go(-1)">返回上一页</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "defalut"
    }
</script>

<style scoped>
    .defalut-png{
        background: #0f1f37;
        width: 100%;
        height: 100%;
        margin: 0;
        display: flex;
        justify-content: flex-start;
    }
    .d-content{
        width: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        padding-left: 10rem;
    }
    .title-four{
        font-size: 48px;
        color: #fff;
        margin: 10px 0;
        font-family: INITIAL;
    }
    .btn-link{
        width: 7rem;
        height: 3rem;
        border: 1px solid #e9f9ff;
        text-align: center;
        line-height: 3rem;
        margin:1rem  1rem 0 0;
        font-size: 16px;
        color: #e9f9ff;
        background: transparent;
        position: relative;
        cursor: pointer;
    }

    .btn-link:after{
        display: block;
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 0%;
        height: 100%;
        z-index: -1;
        background:#e9f9ff ;
        transition: all linear .2s;
    }

</style>
