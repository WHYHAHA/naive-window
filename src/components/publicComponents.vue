
<script>
    import { SearchOutlined as searchIcon } from '@vicons/antd'

    export default {
        install(app) {
            // 此处形参为main.js文件中use()方法自动传进来的Vue实例
            app.component('searchIcon', searchIcon)
        }
    }
</script>
