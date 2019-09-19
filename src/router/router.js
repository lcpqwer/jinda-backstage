import Main from '@/views/Main.vue';

// theme-switch.vue  131行注释了

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => { require(['@/views/login.vue'], resolve); }
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => { require(['@/views/error-page/404.vue'], resolve); }
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: resolve => { require(['@//views/error-page/403.vue'], resolve); }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: resolve => { require(['@/views/error-page/500.vue'], resolve); }
};

export const preview = {
    path: '/preview',
    name: 'preview',
    component: resolve => { require(['@/views/form/article-publish/preview.vue'], resolve); }
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: resolve => { require(['@/views/main-components/lockscreen/components/locking-page.vue'], resolve); }
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: resolve => { require(['@/views/home/home.vue'], resolve); } },
        { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: resolve => { require(['@/views/own-space/own-space.vue'], resolve); } },
        { path: 'order/:order_id', title: '订单详情', name: 'order-info', component: resolve => { require(['@/views/advanced-router/component/order-info.vue'], resolve); } }, // 用于展示动态路由
        { path: 'shopping', title: '购物详情', name: 'shopping', component: resolve => { require(['@/views/advanced-router/component/shopping-info.vue'], resolve); } }, // 用于展示带参路由
        { path: 'article', title: '文章修改', name: 'article', component: resolve => { require(['@/views/advanced-router/component/article.vue'], resolve); } }, // 用于展示带参路由
        { path: 'article_add', title: '新增文章', name: 'article_add', component: resolve => { require(['@/views/advanced-router/component/article_add.vue'], resolve); } }, // 用于展示带参路由
        { path: 'article_add_img', title: '新增文章图片', name: 'article_add_img', component: resolve => { require(['@/views/advanced-router/component/article_add_img.vue'], resolve); } }, // 用于展示带参路由
        { path: 'Recruitment_add_img', title: '招募文章图片', name: 'Recruitment_add_img', component: resolve => { require(['@/views/advanced-router/component/Recruitment_add_img.vue'], resolve); } }, // 用于展示带参路由
        { path: 'price_add', title: '价格表新增', name: 'price_add', component: resolve => { require(['@/views/advanced-router/component/price_add.vue'], resolve); } }, // 用于展示带参路由
        { path: 'price_edit_img', title: '价格表图片', name: 'price_edit_img', component: resolve => { require(['@/views/advanced-router/component/price_edit_img.vue'], resolve); } }, // 用于展示带参路由
        { path: 'Recruitment', title: '添加招募文章', name: 'Recruitment', component: resolve => { require(['@/views/advanced-router/component/Recruitment.vue'], resolve); } }, // 用于展示带参路由
        { path: 'Recruitment_edit', title: '招募文章编辑', name: 'Recruitment_edit', component: resolve => { require(['@/views/advanced-router/component/Recruitment_edit.vue'], resolve); } }, // 用于展示带参路由
        { path: 'message', title: '消息中心', name: 'message_index', component: resolve => { require(['@/views/message/message.vue'], resolve); } },
        { path: 'product_add', title: '新增', name: 'product_add', component: resolve => { require(['@/views/advanced-router/component/product_add.vue'], resolve); } }, // 用于展示带参路由
        { path: 'product_edit', title: '修改', name: 'product_edit', component: resolve => { require(['@/views/advanced-router/component/product_edit.vue'], resolve); } }, // 用于展示带参路由
        { path: 'product_edit_img', title: '修改', name: 'product_edit_img', component: resolve => { require(['@/views/advanced-router/component/product_edit_img.vue'], resolve); } }, // 用于展示带参路由
        { path: 'info_list', title: '车辆修改', name: 'info_list', component: resolve => { require(['@/views/advanced-router/component/info_list.vue'], resolve); } } // 用于展示带参路由
    ]
};
// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    // {
    //     path: '/access',
    //     icon: 'key',
    //     name: 'access',
    //     title: '权限管理',
    //     component: Main,
    //     children: [
    //         { path: 'index', title: '权限管理', name: 'access_index', component: resolve => { require(['@/views/access/access.vue'], resolve); } }
    //     ]
    // },
    // {
    //     path: '/access-test',
    //     icon: 'lock-combination',
    //     title: '产品展示与服务',
    //     name: 'accesstest',
    //     access: 0,
    //     component: Main,
    //     children: [
    //         { path: 'index', title: '', name: 'accesstest_index', access: 0, component: resolve => { require(['@/views/access/access-test.vue'], resolve); } },
    //         { path: 'index', title: '权限测试页', name: 'accesstest_index', access: 0, component: resolve => { require(['@/views/access/access-test.vue'], resolve); } }
    //     ]
    // },
    // {
    //     path: '/international',
    //     icon: 'earth',
    //     title: {i18n: 'international'},
    //     name: 'international',
    //     component: Main,
    //     children: [
    //         { path: 'index', title: {i18n: 'international'}, name: 'international_index', component: resolve => { require(['@/views/international/international.vue'], resolve); } }
    //     ]
    // },
    {
        path: '/product',
        icon: 'ios-infinite',
        name: 'product',
        title: '产品展示与服务',
        component: Main,
        children: [
            { path: 'product_list', title: '产品分类', name: 'product_list', icon: 'link', component: resolve => { require(['@/views/product/product_list.vue'], resolve); } },
            { path: 'product_cont', title: '产品图片', name: 'product_cont', icon: 'link', component: resolve => { require(['@/views/product/product_cont.vue'], resolve); } },
            {path: 'split-pane-page', title: '产品价格', name: 'split-pane-page', icon: 'link', component: resolve => { require(['@/views/product/split-pane/split-pane-page.vue'], resolve); }}
        ]
    },
    {
        path: '/visit',
        icon: 'key',
        name: 'visit',
        title: '销售网络',
        component: Main,
        children: [
            { path: 'visit_content', title: '参观内容', name: 'visit_content', icon: 'link', component: resolve => { require(['@/views/visit/visit_content.vue'], resolve); } },
            { path: 'apply_list', title: '申请列表', name: 'apply_list', icon: 'link', component: resolve => { require(['@/views/visit/apply_list.vue'], resolve); } },
            { path: 'directly', title: '直属分公司公司', name: 'directly', icon: 'link', component: resolve => { require(['@/views/visit/directly.vue'], resolve); } },
            { path: 'column', title: '直属分公司栏目', name: 'column', icon: 'link', component: resolve => { require(['@/views/visit/column.vue'], resolve); } }
        ]
    },
    // {
    //     path: '/user',
    //     icon: 'social-buffer',
    //     name: 'user',
    //     title: '订单信息',
    //     component: Main,
    //     children: [
    //         { path: 'list', title: '订单信息', name: 'list', icon: 'link', component: resolve => { require(['@/views/user/list.vue'], resolve); } }
    //     ]
    // },
    // {
    //     path: '/preference',
    //     icon: 'social-buffer',
    //     name: 'preference',
    //     title: '产品信息',
    //     component: Main,
    //     children: [
    //         { path: 'identifying', title: '品牌信息', name: 'identifying', icon: 'link', component: resolve => { require(['@/views/preference/identifying.vue'], resolve); } }
    //         // { path: 'Preference', title: '产品信息', name: 'Preference', icon: 'link', component: resolve => { require(['@/views/preference/Preference.vue'], resolve); } },
    //         // { path: 'interest', title: '爱好', name: 'interest', icon: 'link', component: resolve => { require(['@/views/preference/interest.vue'], resolve); } },
    //         // { path: 'constellation', title: '星座', name: 'constellation', icon: 'link', component: resolve => { require(['@/views/preference/constellation.vue'], resolve); } },
    //     ]
    // },
    {
        path: '/component',
        icon: 'social-buffer',
        name: 'component',
        title: '新闻中心',
        component: Main,
        children: [
            {
                path: 'text-editor',
                icon: 'compose',
                name: 'text-editor',
                title: '商品领域',
                component: resolve => { require(['@/views/my-components/text-editor/text-editor.vue'], resolve); }
            },
            {
                path: 'md-editor',
                icon: 'pound',
                name: 'md-editor',
                title: '关键词',
                component: resolve => { require(['@/views/my-components/markdown-editor/markdown-editor.vue'], resolve); }
            },
            // {
            //     path: 'image-editor',
            //     icon: 'crop',
            //     name: 'image-editor',
            //     title: '剪切',
            //     component: resolve => { require(['@/views/my-components/image-editor/image-editor.vue'], resolve); }
            // },
            {
                path: 'draggable-list',
                icon: 'arrow-move',
                name: 'draggable-list',
                title: '文章',
                component: resolve => { require(['@/views/my-components/draggable-list/draggable-list.vue'], resolve); }
            },
            {
                path: 'area-linkage',
                icon: 'ios-more',
                name: 'area-linkage',
                title: '位置',
                component: resolve => { require(['@/views/my-components/area-linkage/area-linkage.vue'], resolve); }
            }
        ]
    },
    // {
    //     path: '/form',
    //     icon: 'android-checkbox',
    //     name: 'form',
    //     title: '表单编辑',
    //     component: Main,
    //     children: [
    //         { path: 'artical-publish', title: '新增文章', name: 'artical-publish', icon: 'compose', component: resolve => { require(['@/views/form/article-publish/article-publish.vue'], resolve); } },
    //         { path: 'workflow', title: '工作流', name: 'workflow', icon: 'arrow-swap', component: resolve => { require(['@/views/form/work-flow/work-flow.vue'], resolve); } }
    //     ]
    // },
    // {
    //     path: '/charts',
    //     icon: 'ios-analytics',
    //     name: 'charts',
    //     title: '图表',
    //     component: Main,
    //     children: [
    //         { path: 'pie', title: '饼状图', name: 'pie', icon: 'ios-pie', component: resolve => { require('@/views/access/access.vue') },
    //         { path: 'histogram', title: '柱状图', name: 'histogram', icon: 'stats-bars', component: resolve => { require('@/views/access/access.vue') }

    //     ]
    // },
    // {
    //     path: '/tables',
    //     icon: 'ios-grid-view',
    //     name: 'tables',
    //     title: '表格',
    //     component: Main,
    //     children: [
    //         { path: 'dragableTable', title: '可拖拽排序', name: 'dragable-table', icon: 'arrow-move', component: resolve => { require(['@/views/tables/dragable-table.vue'], resolve); } },
    //         { path: 'editableTable', title: '可编辑表格', name: 'editable-table', icon: 'edit', component: resolve => { require(['@/views/tables/editable-table.vue'], resolve); } },
    //         { path: 'searchableTable', title: '可搜索表格', name: 'searchable-table', icon: 'search', component: resolve => { require(['@/views/tables/searchable-table.vue'], resolve); } },
    //         { path: 'exportableTable', title: '表格导出数据', name: 'exportable-table', icon: 'code-download', component: resolve => { require(['@/views/tables/exportable-table.vue'], resolve); } },
    //         { path: 'table2image', title: '表格转图片', name: 'table-to-image', icon: 'images', component: resolve => { require(['@/views/tables/table-to-image.vue'], resolve); } }
    //     ]
    // },
    {
        path: '/advanced-router',
        icon: 'ios-grid-view',
        name: 'advanced-router',
        title: '商业合作与招聘',
        component: Main,
        children: [
            { path: 'mutative-router', title: '招募文章', name: 'mutative-router', icon: 'link', component: resolve => { require(['@/views/advanced-router/mutative-router.vue'], resolve); } },
            { path: 'argument-page', title: '招募回馈', name: 'argument-page', icon: 'android-send', component: resolve => { require(['@/views/advanced-router/argument-page.vue'], resolve); } }
        ]
    },
    {
        path: '/img-router',
        icon: 'social-buffer',
        name: 'img-router',
        title: '图片',
        component: Main,
        children: [
            { path: 'img', title: '图片', name: 'img', icon: 'link', component: resolve => { require(['@/views/img-router/img.vue'], resolve); } },
        ]
    }
    // {
    //     path: '/error-page',
    //     icon: 'android-sad',
    //     title: '错误页面',
    //     name: 'errorpage',
    //     component: Main,
    //     children: [
    //         { path: 'index', title: '错误页面', name: 'errorpage_index', component: resolve => { require(['@/views/error-page/error-page.vue'], resolve); } }
    //     ]
    // }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    preview,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];
