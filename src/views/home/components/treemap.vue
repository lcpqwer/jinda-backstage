<template>
    <div style="width:100%;height:100%;" id="treemap"></div>
</template>

<script>
    import echarts from 'echarts';
    export default {
        name: 'treemap',
        data () {
            return {
            };
        },
        methods: {
        },
        mounted () {
            this.axios.post('Index/show', {
            }).then(res => {
                // var arrs = ['1000', '2000', '3000', '4000', '5000', '6000', '7000']
                const option = {
                    series: [{
                        type: 'treemap',
                        data: [{
                            name: 'nodeA',
                            value: 10,
                            children: [
                                {
                                    name: 'nodeAa_2',
                                    value: 4
                                },
                                {
                                    name: 'nodeAb_1',
                                    value: 6
                                },
                                {
                                    name: 'nodeAa_5',
                                    value: 4
                                }
                            ]
                        }, {
                            name: 'nodeB1',
                            value: 20,
                            children: [{
                                name: 'nodeBa2',
                                value: 20,
                                children: [{
                                    name: 'nodeBa1_3',
                                    value: 20
                                }]
                            }]
                        }]
                    }]
                };
                const serviceRequestCharts = echarts.init(document.getElementById('treemap'));
                serviceRequestCharts.setOption(option);

                window.addEventListener('resize', function () {
                    serviceRequestCharts.resize();
                });
            }).catch(err => {
                this.$Message.error('请求超时,请稍后再试...');
            });
        }
    };
</script>