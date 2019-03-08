import router from '../router'
import routerComponents from '../router/routerComponents'

// 懒加载组件
function lazy(name) {
  return routerComponents[name]
}

function generateMenu(routes, dynamicRoutes){
  dynamicRoutes.forEach((item)=>{
    let menu = Object.assign({},item)
    menu.component = lazy(menu.component)
    if (item.children){
      menu.children = []
      generateMenu(menu.children, item.children)
    }
    routes.push(menu)
  })
}

const ADD_ROUTES = 'ADD_ROUTES'

const addRoutes = {
  state: {
    routeData: []
  },
  mutations: {
    [ADD_ROUTES](state, dynamicRoutes) {
      let routes = []
      generateMenu(routes, dynamicRoutes) // 将后台的路由数据components转化成组件
      console.log("路由")
      console.log(routes)
      router.addRoutes(routes)  // 添加路由
      router.push('/')
    }
  },
  actions: {
    add_Routes({commit}, dynamicRoutes) {
      commit(ADD_ROUTES, dynamicRoutes)
    }
  }
}
export default addRoutes
