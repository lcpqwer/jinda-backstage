<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
    <div>
        <Row>
            <Col span="8">
                <span class="expand-key" style="font-weight: 700">手机号: </span>
                <span class="expand-value">{{ row.phone }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key" style="font-weight: 700">邮箱: </span>
                <span class="expand-value">{{ row.email }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key" style="font-weight: 700">预约时间: </span>
                <span class="expand-value">{{ row.Time }}</span>
            </Col>
        </Row>
        <Row class="expand-row" style="margin-top: 15px">
            <!--<Col span="8">-->
            <!--<span class="expand-key">Job: </span>-->
            <!--<span class="expand-value">{{ row.job }}</span>-->
            <!--</Col>-->
            <Col span="24">
                <span class="expand-key" style="font-weight: 700">申请内容: </span>
                <span class="expand-value">{{ row.content }}</span>
            </Col>
            <!--<Col span="8">-->
            <!--<span class="expand-key">Interest: </span>-->
            <!--<span class="expand-value">{{ row.interest }}</span>-->
            <!--</Col>-->
            <!--<Col span="8">-->
            <!--<span class="expand-key">Birthday: </span>-->
            <!--<span class="expand-value">{{ row.birthday }}</span>-->
            <!--</Col>-->
        </Row>
        <!--<Row>-->
        <!--<Col span="8">-->
        <!--<span class="expand-key">Favorite book: </span>-->
        <!--<span class="expand-value">《{{ row.book }}》</span>-->
        <!--</Col>-->
        <!--<Col span="8">-->
        <!--<span class="expand-key">Favorite movie: </span>-->
        <!--<span class="expand-value">{{ row.movie }}</span>-->
        <!--</Col>-->
        <!--<Col span="8">-->
        <!--<span class="expand-key">Favorite music: </span>-->
        <!--<span class="expand-value">{{ row.music }}</span>-->
        <!--</Col>-->
        <!--</Row>-->
    </div>
</template>
<script>
    export default {
        props: {
            row: Object
        }
    };
</script>