import '@/utils/mock/user'
import '@/utils/mock/indexes'
import '@/utils/mock/stock'
import '@/utils/mock/analysis'
import '@/utils/mock/passage'

export default defineNuxtPlugin(() => {
    if (process.env.NODE_ENV === 'development') {
        console.log('Mock服务已启用')
    }
})
