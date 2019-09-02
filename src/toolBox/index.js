
/*
 * 检查权限
 * @param routerAccess 路由权限
 * @param userAccess 用户权限
 */
export const check = (routerList,userAccess) => { //fish
	let res = [];
	routerList.forEach(item => {
		if(!item.meta || (item.meta && !item.meta.hideMenu)) {
			let obj = {
				icon: (item.meta && item.meta.icon) || '',
				name: item.name,
				meta: item.meta
			}
			if(((item.children && item.children.length > 0) || (item.meta && item.meta.showAlways)) && checkRoute(item.meta.access, userAccess)){
				obj.children = check(item.children, userAccess);
			}
			if(item.meta && item.meta.href) obj.href = item.meta.href
			if(checkRoute(item.meta.access, userAccess)) res.push(obj)
		}
	})
	return res;
	
}
export const checkRoute = (routerAccess, userAccess) => { //路由权限,用户权限 fish
	let access = JSON.parse(userAccess)
	// if((routerAccess && routerAccess.length > 0) && (access && access.length > 0)){ //页面有权限且自己也有权限的时候判断
	if(routerAccess&&routerAccess.length >0){ //页面有权限设置
		if(access && access.length > 0){//个人有权限
			let is = false;
			access.forEach(item =>{
				if(routerAccess.indexOf(item)>-1){
					is = true;
				}
			});
			return is;
		}else{
			return false;
		}

		// return routerAccess.some((a,index) => a == item);权限是单一的时候['admin']可以用
	}else {//该路由没权限的时候true
		return true;
		console.log('页面没权限呢 ')
	}
}
export const checkRouter = (routers,userAccess) => { //fish 用于过滤没权限的菜单
	let filterResult = [];
	return check(routers,userAccess);
}



/**
 * @param {*} obj1 对象
 * @param {*} obj2 对象
 * @description 判断两个对象是否相等，这两个对象的值只能是数字或字符串
 */
export const objEqual = (obj1, obj2) => {
	const keysArr1 = Object.keys(obj1)
	const keysArr2 = Object.keys(obj2)
	if(keysArr1.length !== keysArr2.length) return false
	else if(keysArr1.length === 0 && keysArr2.length === 0) return true
	/* eslint-disable-next-line */
	else return !keysArr1.some(key => obj1[key] != obj2[key])
}

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
	const params1 = route1.params || {}
	const params2 = route2.params || {}
	const query1 = route1.query || {}
	const query2 = route2.query || {}
	return(route1.name === route2.name) && objEqual(params1, params2) && objEqual(query1, query2)
}

/*
 * 跳转的路由路径不完整
 */
export const pathImperfect = (routeList, routeName) => {
	const imperfect = (list) => {
		return list.some(item => {
			if(item.children && item.children.length > 0) if(item.name === routeName) return true; else return imperfect(item.children);
		});
	}
	return imperfect(routeList);
}
